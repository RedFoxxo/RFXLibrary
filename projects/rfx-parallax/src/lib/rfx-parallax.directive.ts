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
  private scrollTop: number;

  private parallaxSpace: RfxParallaxSpacesModel;
  private parallaxBoundaries: RfxParallaxBoundariesModel;

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
    this.onScrollListener = this.rfxParallaxService.getMouseScroll().subscribe((scroll: number) => this.onMouseScroll(scroll));
    this.onResizeListener = this.rfxParallaxService.getWindowResize().subscribe((width: number) => this.onWindowResize(width));
  }

  /**
   * Set transform property based on the new scroll value
   * @param scroll new element scroll value
   */
  private onMouseScroll(scroll: number): void {
    if (scroll !== undefined && this.image) {
      // this.scrollTop = scroll;
      this.getImageTop(scroll, this.parallaxBoundaries);
      // this.setImageTransform(this.imageLeft, this.imageTop);
    }
  }

  /**
   * Reset parallax properties according to new window size
   * @param width window new width value
   */
  private onWindowResize(width: number): void {
    if (width !== undefined && this.image) {
      this.setParallaxProperties(this.scrollTop);
    }
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
    this.setImageSize(this.htmlElement.nativeElement, this.image, this.parallaxPercentage);

    const containerRect = this.htmlElement.nativeElement.getBoundingClientRect();
    this.parallaxSpace = this.getParallaxSpace(this.htmlElement.nativeElement.clientHeight, this.image.height, this.parallaxPercentage);
    this.parallaxBoundaries = this.getParallaxBoundaries(containerRect, scrollTop, this.parallaxSpace, this.visibleOverflow);
    const imageLeft = this.getImageLeft(this.htmlElement.nativeElement.clientWidth, this.image.width, this.positionPercentage);
    const imageTop = this.getImageTop(scrollTop, this.parallaxBoundaries);

    this.setImageTransform(this.image, imageLeft, imageTop);
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
  private setImageSize(container: HTMLElement, image: HTMLImageElement, parallaxPercentage: number): void {
    const minHeight = (container.clientHeight * (100 + parallaxPercentage)) / 100;
    const ratio = image.naturalHeight / image.naturalWidth;
    const minRatio = minHeight / container.clientWidth;

    if (ratio > minRatio) {
      this.image.setAttribute('width', `${container.clientWidth}px`);
      this.image.setAttribute('height', `auto`);
    } else {
      this.image.setAttribute('height', `${minHeight}px`);
      this.image.setAttribute('width', `auto`);
    }
  }

  /**
   * Get parallax scrolling visible area.
   * Use this when container overflow is hidden for better page performance
   * @param element main container DOMRect
   * @param scrollTop pixels from the top of the page to the current view
   * @param availableSpace available space outside main container
   */
  private getParallaxBoundaries(
    element: DOMRect,
    scrollTop: number,
    space: RfxParallaxSpacesModel,
    overflow: boolean
  ): RfxParallaxBoundariesModel {
    const elementTop = element.top + scrollTop;
    const startPoint = elementTop - space.available;
    const endPoint = elementTop + element.height + space.available;
    const startPointUsable = elementTop - space.usable;
    const endPointUsable = elementTop + element.height + space.usable;
    const startPointVisible = overflow ? startPoint : elementTop;
    const endPointVisible = overflow ? endPoint : elementTop + element.height;
    return new RfxParallaxBoundariesModel(startPoint, endPoint, startPointUsable, endPointUsable, startPointVisible, endPointVisible);
  }

  /**
   * Get parallax available, usable and unusable space
   * Use this when you want to maintain a constant image scroll ratio
   * @param element main conatiner DOMRect
   * @param image parallax html image
   * @param usablePercentage parallax scrol percentage
   */
  private getParallaxSpace(elementHeight: number, imageHeight: number, usablePercentage: number): RfxParallaxSpacesModel {
    const availableSpace = imageHeight - elementHeight;
    const usableSpace = elementHeight / 100 * usablePercentage;
    const unusableSpace = availableSpace - usableSpace;
    return new RfxParallaxSpacesModel(availableSpace, usableSpace, unusableSpace);
  }

  /**
   * Set image transform property
   * @param image image HTMLImageElement element
   * @param imageLeft image left shift in pixels
   * @param imageTop image top shift in pixels
   */
  private setImageTransform(image: HTMLImageElement, imageLeft: number, imageTop: number): void {
    this.renderer.setStyle(image, 'transform', `translate(${imageLeft}px, ${imageTop}px)`);
  }

  /**
   * Get image left property based on positionPercentage in pixels
   * @param containerWidth main container width
   * @param imageWidth image width
   * @param positionPercentage image position percentage
   */
  private getImageLeft(containerWidth: number, imageWidth: number, positionPercentage: number): number {
    return (containerWidth - imageWidth) / 100 * positionPercentage;
  }

  /**
   * Get image top shift in pixels
   * @param scrollTop pixels from the top of the page to the current view
   */
  private getImageTop(scrollTop: number, boundaries: RfxParallaxBoundariesModel): number {
    if (this.test) {


      if (scrollTop + window.innerHeight >= boundaries.startPointVisible && scrollTop <= boundaries.endPointVisible) {
        const usableSpace = Math.abs(boundaries.startPointUsable) + boundaries.endPointUsable;

        console.warn(boundaries);
        console.warn(usableSpace, scrollTop, boundaries.startPointUsable, boundaries.endPointUsable);

        const onePixel = 960 / 100;
        //   960 / 30 = 32 ->
        const top = 960 / 30;
        //console.warn(top);
      }


    }

    return 0;

    // const parallaxScrollArea =


    // const parallaxPositionPixels = this.visibleOverflow ? scrollTop - this.startPoint : Math.min(
    //   this.parallaxArea, Math.max(0, scrollTop - this.startPoint));

    // const imageTop = (this.availablePixels / 100) * (100 - (100 * parallaxPositionPixels) / this.parallaxArea);

    // return -imageTop;
  }

  // const parallaxArea = boundaries.endPoint - boundaries.startPoint; // MOVE UPPER
}
