import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxParallaxService } from './rfx-parallax.service';
import { RfxParallaxBoundariesModel } from './rfx-parallax-boundaries.model';

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

  // @Input() public test: boolean; // TODO!: remove

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
    this.parallaxPercentage = 10;
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
      const imageTop = this.getImageTop(scroll, this.parallaxBoundaries);
      this.setImageTransform(this.image, this.imageLeft, imageTop);
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
   * @param scrollTop page container pixels from the top of the page to the current view
   */
  private setParallaxProperties(scrollTop: number): void {
    const containerElement = this.htmlElement.nativeElement;
    const containerRect = this.htmlElement.nativeElement.getBoundingClientRect();
    const elementTop = containerRect.top + scrollTop;
    this.setStaticProperties();
    this.setImageSize(containerElement, this.image, this.parallaxPercentage);
    this.parallaxBoundaries = this.getParallaxBoundaries(elementTop, containerElement.clientHeight, this.parallaxPercentage);
    this.imageLeft = this.getImageLeft(this.htmlElement.nativeElement.clientWidth, this.image.width, this.positionPercentage);
    const imageTop = this.getImageTop(scrollTop, this.parallaxBoundaries);
    this.setImageTransform(this.image, this.imageLeft, imageTop);
  }

  /**
   * Set default properties for container and image
   */
  private setStaticProperties(): void {
    if (!this.isAlreadyPositioned(this.htmlElement.nativeElement)) {
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
  private isAlreadyPositioned(element: Element): boolean {
    return ['absolute', 'relative'].includes(window.getComputedStyle(element).position);
  }

  /**
   * Set default image size that match properties
   * @param container main container HTMLElement
   * @param image main image HTMLElement
   * @param parallaxPercentage parallax scroll percentage
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
    this.renderer.setStyle(image, 'transform', `translate(${imageLeft}px, ${imageTop}px)`);
    // this.renderer.setStyle(image, 'transform', `translate3d(${imageLeft}px, ${imageTop}px, 0)`);
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
