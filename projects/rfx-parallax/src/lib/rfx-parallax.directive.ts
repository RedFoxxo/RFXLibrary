import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxParallaxService } from './rfx-parallax.service';
import { RfxParallaxBoundariesModel, RfxParallaxPositionModel } from './_models';

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

  private imageLoaded: boolean;
  private image: HTMLImageElement;
  private imageLeft: number;
  private scrollTop: number;
  private parallaxBoundaries: RfxParallaxBoundariesModel;

  private onScrollListener: Subscription;
  private onResizeListener: Subscription;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private rfxParallaxService: RfxParallaxService
  ) {
    this.parallaxPercentage = 40;
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
    this.scrollTop = scroll ?? 0;

    if (this.imageLoaded) {
      const imageTop = this.getImageTop(scroll, this.parallaxBoundaries);
      this.setImageTransform(this.image, this.imageLeft, imageTop);
    }
  }

  /**
   * Reset parallax properties according to new window size
   * @param width window new width value
   */
  private onWindowResize(width: number): void {
    if (width !== undefined && this.imageLoaded) {
      const imagePosition: RfxParallaxPositionModel = this.setParallaxPosition(this.htmlElement.nativeElement, this.image);
      this.setImageTransform(this.image, imagePosition.left, imagePosition.top);
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
      this.setStaticProperties(this.htmlElement.nativeElement, this.image);
      const imagePosition: RfxParallaxPositionModel = this.setParallaxPosition(this.htmlElement.nativeElement, this.image);
      this.setImageTransform(this.image, imagePosition.left, imagePosition.top);
      this.renderer.setStyle(this.image, 'visiblity', 'visible');
      this.imageLeft = imagePosition.left;
      this.imageLoaded = true;
    };
  }

  /**
   * Set default image size and return new parallax position
   * @param container main container HTMLElement
   * @param image main image HTMLElement
   */
  private setParallaxPosition(container: HTMLElement, image: HTMLImageElement): RfxParallaxPositionModel {
    this.setImageSize(container.clientWidth, container.clientHeight, image, this.parallaxPercentage);
    const elementTop = container.getBoundingClientRect().top + this.scrollTop;
    this.parallaxBoundaries = this.getParallaxBoundaries(elementTop, container.clientHeight, this.parallaxPercentage);
    const imageLeft = this.getImageLeft(container.clientWidth, image.width, this.positionPercentage);
    const imageTop = this.getImageTop(this.scrollTop, this.parallaxBoundaries);
    return new RfxParallaxPositionModel(imageLeft, imageTop);
  }

  /**
   * Set default properties for container and image
   * @param container main container HTMLElement
   * @param image main image HTMLElement
   */
  private setStaticProperties(container: HTMLElement, image: HTMLImageElement): void {
    if (!this.isAlreadyPositioned(container)) {
      this.renderer.setStyle(container, 'position', 'relative');
    }

    this.renderer.setStyle(container, 'overflow', this.visibleOverflow ? 'visible' : 'hidden');
    this.renderer.setStyle(image, 'z-index', this.imageZIndex);
    this.renderer.setStyle(image, 'position', 'absolute');
    this.renderer.setStyle(image, 'left', '0');
    this.renderer.setStyle(image, 'top', '0');
  }

  /**
   * Check if element has position absolute or relative
   * @param element html element
   */
  private isAlreadyPositioned(element: HTMLElement): boolean {
    return ['absolute', 'relative'].includes(window.getComputedStyle(element).position);
  }

  /**
   * Set default image size that match properties
   * @param containerWidth main container HTMLElement width
   * @param containerHeight main container HTMLElement height
   * @param image main image HTMLElement
   * @param parallaxPercentage parallax scroll percentage
   */
  private setImageSize(containerWidth: number, containerHeight: number, image: HTMLImageElement, parallaxPercentage: number): void {
    const minHeight = (containerHeight * (100 + parallaxPercentage)) / 100;
    const ratio = image.naturalHeight / image.naturalWidth;
    const minRatio = minHeight / containerWidth;

    if (ratio > minRatio) {
      this.image.setAttribute('width', `${containerWidth}px`);
      this.image.setAttribute('height', `auto`);
    } else {
      this.image.setAttribute('height', `${minHeight}px`);
      this.image.setAttribute('width', `auto`);
    }
  }

  /**
   * Get parallax scrolling visible area.
   * Use this when container overflow is hidden for better page performance
   * @param elementTop main container position from the top of the document in pixels
   * @param elementHeight main container height in pixels
   * @param parallaxPercentage parallax scroll percentage
   */
  private getParallaxBoundaries(elementTop: number, elementHeight: number, parallaxPercentage: number): RfxParallaxBoundariesModel {
    const usablePixels = elementHeight / 100 * parallaxPercentage;
    const startPoint = elementTop - usablePixels - window.innerHeight;
    const endPoint = elementTop + elementHeight + usablePixels;
    const totalPixels = endPoint - startPoint;
    return new RfxParallaxBoundariesModel(startPoint, endPoint, totalPixels, usablePixels);
  }

  /**
   * Set image transform property
   * @param image image HTMLImageElement element
   * @param imageLeft image left shift in pixels
   * @param imageTop image top shift in pixels
   */
  private setImageTransform(image: HTMLImageElement, imageLeft: number, imageTop: number): void {
    this.renderer.setStyle(image, 'transform', `translate3d(${imageLeft}px, ${imageTop}px, 0)`);
  }

  /**
   * Get image left property based on positionPercentage in pixels
   * @param containerWidth main container width in pixels
   * @param imageWidth image width in pixels
   * @param positionPercentage image position percentage
   */
  private getImageLeft(containerWidth: number, imageWidth: number, positionPercentage: number): number {
    return (containerWidth - imageWidth) / 100 * positionPercentage;
  }

  /**
   * Get image top shift in pixels
   * @param scrollTop pixels from the top of the page to the current view
   * @param boundaries parallax position points inside the page
   */
  private getImageTop(scrollTop: number, boundaries: RfxParallaxBoundariesModel): number {
    const parallaxArea: number = Math.max(0, Math.min(scrollTop - boundaries.startPoint, boundaries.totalPixels));
    const parallaxAreaPercentage: number = 100 / boundaries.totalPixels * parallaxArea;
    return -boundaries.usablePixels * (1 - parallaxAreaPercentage / 100);
  }
}
