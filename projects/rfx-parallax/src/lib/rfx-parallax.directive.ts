import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxParallaxService } from './rfx-parallax.service';
import { RfxParallaxBoundariesModel, RfxParallaxSpacesModel } from './_models';

@Directive({
  selector: '[libRfxParallax]'
})
export class RfxParallaxDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public parallaxPercentage: number;
  @Input() public positionPercentage: number;
  @Input() public imageUrl: string;
  @Input() public imageZIndex: number;
  @Input() public visibleOverflow: boolean;
  @Input() public isDisabled: boolean;

  @Input() public test: boolean;

  private image: HTMLImageElement;
  private imageLeft: number;
  private imageTop: number;
  private scrollTop: number;

  private ignoredPixels: number;
  private availablePixels: number;
  private startPoint: number;
  private endPoint: number;

  private onScrollListener: Subscription;
  private onResizeListener: Subscription;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private rfxParallaxService: RfxParallaxService
  ) {
    this.parallaxPercentage = 30;
    this.positionPercentage = 50;
    this.imageZIndex = -1;
    this.isDisabled = false;
    this.visibleOverflow = false;
    this.scrollTop = 0;
  }

  public ngOnInit(): void {
    this.setListeners();
  }

  public ngOnDestroy(): void {
    if (this.onScrollListener) {
      this.onScrollListener.unsubscribe();
    }

    if (this.onResizeListener) {
      this.onResizeListener.unsubscribe();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageUrl?.currentValue) {
      this.loadImage(changes.imageUrl.currentValue);
    } else if (this.image) {
      this.setParallaxProperties(this.scrollTop);
    }
  }

  /**
   * Subscribe to scroll and resize listeners
   */
  private setListeners(): void {
    this.onScrollListener = this.rfxParallaxService.getMouseScroll().subscribe((scroll: number) => {
      if (scroll !== undefined && this.image) {
        this.scrollTop = scroll;
        this.imageTop = this.getImageTop(scroll);
        this.setImageTransform(this.imageLeft, this.imageTop);
      }
    });

    this.onResizeListener = this.rfxParallaxService.getWindowResize().subscribe((width: number) => {
      if (width && this.image) {
        this.setParallaxProperties(this.scrollTop);
      }
    });
  }

  /**
   * Load parallax image from imageUrl
   * @param imageUrl image url
   */
  private loadImage(imageUrl: string): void {
    this.image = new Image();
    this.image.src = imageUrl;
    this.image.setAttribute('class', 'parallax-image');
    this.renderer.setStyle(this.image, 'visiblity', 'hidden');
    this.htmlElement.nativeElement.appendChild(this.image);

    this.image.onload = () => {
      this.setParallaxProperties(this.scrollTop);
      this.renderer.setStyle(this.image, 'visiblity', 'visible');
    };
  }

  /**
   * Set parallax properties and position
   * @param scrollTop page container pixels from the top of the page
   */
  private setParallaxProperties(scrollTop: number): void {
    this.setStaticProperties();
    this.setImageSize();
    this.setParallaxValues(scrollTop);
    this.imageLeft = this.getImageLeft(this.htmlElement.nativeElement.clientWidth);
    this.imageTop = this.getImageTop(scrollTop);
    this.setImageTransform(this.imageLeft, this.imageTop);
  }

  /**
   * Set default properties for container and image
   */
  private setStaticProperties(): void {
    if (!this.isAlreadyPositionAbsRel(this.htmlElement.nativeElement)) {
      this.renderer.setStyle(this.htmlElement.nativeElement, 'position', 'relative');
    }

    this.renderer.setStyle(this.htmlElement.nativeElement, 'overflow', this.visibleOverflow ? 'visible' : 'hidden');
    this.renderer.setStyle(this.image, 'z-index', this.imageZIndex);
    this.renderer.setStyle(this.image, 'position', 'absolute');
    this.renderer.setStyle(this.image, 'left', '0');
    this.renderer.setStyle(this.image, 'top', '0');
  }

  /**
   * Check if element has position absolute or relative
   * @param element html element
   */
  private isAlreadyPositionAbsRel(element: Element): boolean {
    return ['absolute', 'relative'].includes(window.getComputedStyle(element).position);
  }

  /**
   * Set default image size that match properties
   */
  private setImageSize(): void {
    const minHeight = (this.htmlElement.nativeElement.clientHeight * (100 + this.parallaxPercentage)) / 100;
    const ratio = this.image.naturalHeight / this.image.naturalWidth;
    const minRatio = minHeight / this.htmlElement.nativeElement.clientWidth;

    if (ratio > minRatio) {
      this.renderer.setStyle(this.image, 'width', `${this.htmlElement.nativeElement.clientWidth}px`);
      this.renderer.setStyle(this.image, 'height', 'auto');
    } else {
      this.renderer.setStyle(this.image, 'height', `${minHeight}px`);
      this.renderer.setStyle(this.image, 'width', 'auto');
    }
  }

  /**
   * Get parallax scrolling visible area.
   * Use this when container overflow is hidden for better page performance
   * @param element main container DOMRect
   * @param scrollTop pixels from the top of the page to the current view
   */
  private getParallaxBoundaries(element: DOMRect, scrollTop: number): RfxParallaxBoundariesModel {
    const startPoint = element.top + scrollTop - window.innerHeight;
    const endPoint = element.top + scrollTop + element.height;
    return new RfxParallaxBoundariesModel(startPoint, endPoint);
  }

  /**
   * Get parallax available, usable and unusable space
   * Use this when you want to maintain a constant image scroll ratio
   * @param element main conatiner DOMRect
   * @param image parallax html image
   * @param usablePercentage parallax scrol percentage
   */
  private getParallaxSpace(element: DOMRect, image: HTMLImageElement, usablePercentage: number): RfxParallaxSpacesModel {
    const availableSpace = image.height - element.height;
    const usableSpace = element.height / 100 * usablePercentage;
    const unusableSpace = availableSpace - usableSpace;
    return new RfxParallaxSpacesModel(availableSpace, usableSpace, unusableSpace);
  }

  /**
   * Set image transform property
   * @param imageLeft image left shift in pixels
   * @param imageTop imagetop shift in pixels
   */
  private setImageTransform(imageLeft: number, imageTop: number): void {
    this.renderer.setStyle(this.image, 'transform', `translate(${imageLeft}px, ${imageTop}px)`);
  }

  /**
   * Get image left shift in pixels
   * @param containerWidth container width in pixels
   */
  private getImageLeft(containerWidth: number): number {
    return -((this.image.width - containerWidth) / 100 * this.positionPercentage);
  }

  /**
   * Get image top shift in pixels
   * @param scrollTop pixels from the top of the page to the current view
   */
  private getImageTop(scrollTop: number): number {
    if (this.isDisabled) {
      return -this.availablePixels / 2;
    }

    const parallaxArea = this.endPoint - this.startPoint;
    const parallaxPositionPixels = this.visibleOverflow ? scrollTop - this.startPoint : Math.min(
      parallaxArea, Math.max(0, scrollTop - this.startPoint));
    const imageTop = (this.availablePixels / 100) * (100 - (100 * parallaxPositionPixels) / parallaxArea);
    return -imageTop;
  }
}
