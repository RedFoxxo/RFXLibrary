import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxParallaxService } from './rfx-parallax.service';

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

  private image: HTMLImageElement;
  private availablePixels: number;
  private startPoint: number;
  private endPoint: number;
  private imageLeft: number;
  private imageTop: number;
  private scrollTop: number;

  private onScrollListener: Subscription;
  private onResizeListener: Subscription;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private rfxParallaxService: RfxParallaxService
  ) {
    this.parallaxPercentage = 20;
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
    this.renderer.setStyle(this.image, 'visilibity', 'hidden');
    this.renderer.addClass(this.image, 'parallax-image');
    this.htmlElement.nativeElement.appendChild(this.image);

    this.image.onload = () => {
      this.setParallaxProperties(this.scrollTop);
      this.renderer.setStyle(this.image, 'visibility', 'visible');
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
    const boxHeight = this.htmlElement.nativeElement.clientHeight;
    const boxWidth = this.htmlElement.nativeElement.clientWidth;
    const minHeight = (boxHeight * (100 + this.parallaxPercentage)) / 100;
    const ratio = this.image.naturalHeight / this.image.naturalWidth;
    const minRatio = minHeight / boxWidth;

    if (ratio > minRatio) {
      this.renderer.setStyle(this.image, 'width', `${boxWidth}px`);
      this.renderer.setStyle(this.image, 'height', 'auto');
    } else {
      this.renderer.setStyle(this.image, 'height', `${minHeight}px`);
      this.renderer.setStyle(this.image, 'width', 'auto');
    }
  }

  /**
   * Set available pixels and start & stop parallax points for better cpu usage
   * @param scrollTop pixels from the top of the page to the current view
   */
  private setParallaxValues(scrollTop: number): void {
    const elementPosition = this.htmlElement.nativeElement.getBoundingClientRect();
    this.availablePixels = this.image.height - elementPosition.height;
    this.startPoint = elementPosition.top + scrollTop - window.innerHeight;
    this.endPoint = elementPosition.top + scrollTop + elementPosition.height;
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

    const parallaxPositionPixels = Math.min(this.endPoint - this.startPoint, Math.max(0, scrollTop - this.startPoint));
    const imageTop = (this.availablePixels / 100) * (100 - (100 * parallaxPositionPixels) / (this.endPoint - this.startPoint));
    return -imageTop;
  }
}
