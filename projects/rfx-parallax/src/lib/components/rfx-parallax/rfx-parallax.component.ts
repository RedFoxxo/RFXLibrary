import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ScrollEventService } from 'rfx-scroll-animation';
import { Subscription } from 'rxjs';
import { ParallaxBoundariesModel } from '../../models';

@Component({
  selector: '[libRfxParallax]',
  templateUrl: './rfx-parallax.component.html',
  styleUrls: ['./rfx-parallax.component.less']
})
export class RfxParallaxComponent implements OnInit {
  /**
   * Image url.
   * Can be http(s) or relative path.
   * TODO: Add support for fallback.
   * @type {string}
   */
  @Input()
  public imageUrl: string | undefined;

  /**
   * Percentage of image scrolling.
   * e.g. 40% will scroll 40% of the image.
   * Default is 40.
   * @type {number}
   */
  @Input()
  public parallaxPercentage: number;

  /**
   * Image view position in percentage.
   * e.g. 50% will show centered image in container.
   * Default is 50.
   * @type {number}
   */
  @Input()
  public positionPercentage: number;

  /**
   * Image z-index property.
   * Default is -1.
   * @type {number}
   */
  @Input()
  public imageZIndex: number;

  /**
   * Show or hide image overflow on container.
   * Default is false (hide).
   * @type {boolean}
   */
  @Input()
  public visibleOverflow: boolean;

  /**
   * Disable image parallax effect and
   * restore default image position.
   * Useful on low performance devices.
   * @type {boolean}
   */
  @Input()
  public isDisabled: boolean;

  /**
   * Subscription to scroll event.
   * @type {Subscription | undefined}
   */
  private scrollEventListener: Subscription | undefined;

  /**
   * Parallaxed image boundaries.
   * @type {ParallaxBoundariesModel | undefined}
   */
  private parallaxBoundaries: ParallaxBoundariesModel | undefined;

  /**
   * Image to be parallaxed.
   * @type {HTMLImageElement | undefined}
   */
  private image: HTMLImageElement | undefined;

  /**
   * Image left position.
   * We save this value and reduce overhead of
   * calculating it every time on scroll.
   * @type {number}
   */
  private imageLeftPx: number;


  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private scrollEventService: ScrollEventService
  ) {
    this.parallaxPercentage = 40;
    this.positionPercentage = 50;
    this.imageZIndex = -1;
    this.isDisabled = false;
    this.visibleOverflow = false;
    this.imageLeftPx = 0;
  }

  public ngOnInit(): void {
    this.setContainerPosition(this.htmlElement.nativeElement);
    this.setContainerOverflow(this.htmlElement.nativeElement, this.visibleOverflow);

    this.scrollEventListener = this.scrollEventService.getMouseScroll().subscribe(
      (scroll: number) => this.onMouseScroll(scroll)
    );
  }

  /**
   * On mouse scroll event recalculate and change
   * parallaxed image position.
   * @param {number} scroll - Scroll value.
   */
  private onMouseScroll(scroll: number): void {
    if (this.parallaxBoundaries && this.image) {
      const topPx: number = this.getImageTop(scroll, this.parallaxBoundaries, this.isDisabled);
      this.setImageTransform(this.image, this.imageLeftPx, topPx);
    }
  }

  /**
   * Set image properties after image is fully loaded.
   * @param {Event} event - Image loaded event.
   */
  public onImageLoaded(event: Event): void {
    this.image = event.target as HTMLImageElement;
    const scrollTop: number = this.scrollEventService.getMouseScrollValue();

    this.setImageSize(
      this.image,
      this.htmlElement.nativeElement.clientWidth,
      this.htmlElement.nativeElement.clientHeight,
      this.parallaxPercentage,
      this.isDisabled
    );

    this.parallaxBoundaries = this.getParallaxBoundaries(
      scrollTop,
      this.htmlElement.nativeElement,
      this.image.height,
      this.parallaxPercentage
    );

    this.imageLeftPx = this.getImageLeft(this.htmlElement.nativeElement.clientWidth, this.image.width, this.positionPercentage);
    const topPx: number = this.getImageTop(scrollTop, this.parallaxBoundaries, this.isDisabled);

    this.setImageTransform(this.image, this.imageLeftPx, topPx);
  }

  /**
   * Set container position to relative
   * if image is not already in relative or absolute position.
   * @param {HTMLElement} container
   */
  private setContainerPosition(container: HTMLElement): void {
    if (container.style.position !== 'relative' && container.style.position !== 'absolute') {
      this.renderer.setStyle(container, 'position', 'relative');
    }
  }

  /**
   * Set container overflow.
   * @param {HTMLElement} container - Container element.
   * @param {boolean} isOverflowVisible - true to show container overflow.
   */
  private setContainerOverflow(container: HTMLElement, isOverflowVisible: boolean): void {
    this.renderer.setStyle(container, 'overflow', isOverflowVisible ? 'visible' : 'hidden');
  }

  /**
   * Set image size based on container size,
   * parallax percentage and disabled state.
   * @param {HTMLImageElement} image - Image element.
   * @param {number} containerWidth - Container width.
   * @param {number} containerHeight - Container height.
   * @param {number} parallaxPercentage - Parallax percentage.
   * @param {boolean} isDisabled - true to disable parallax effect.
   */
  private setImageSize(
    image: HTMLImageElement,
    containerWidth: number,
    containerHeight: number,
    parallaxPercentage: number,
    isDisabled: boolean
  ): void {
    const minimumHeight: number = (containerHeight * (100 + (isDisabled ? 0 : parallaxPercentage))) / 100;
    const ratio: number = image.naturalHeight / image.naturalWidth;
    const minimumRatio: number = minimumHeight / containerWidth;

    if (ratio > minimumRatio) {
      this.renderer.setAttribute(image, 'width', `${containerWidth}px`);
      this.renderer.setAttribute(image, 'height', `auto`);
    } else {
      this.renderer.setAttribute(image, 'width', `auto`);
      this.renderer.setAttribute(image, 'height', `${minimumHeight}px`);
    }
  }

  /**
   * Get parallax boundaries. This data is used
   * to calculate parallax movement.
   * @param {number} scrollTop - Scroll top.
   * @param {HTMLElement} container - Container element.
   * @param {number} imageHeight - Image height.
   * @param {number} parallaxPercentage - Parallax percentage.
   * @return {ParallaxBoundariesModel}
   */
  private getParallaxBoundaries(scrollTop: number, container: HTMLElement, imageHeight: number, parallaxPercentage: number): ParallaxBoundariesModel {
    const elementTop: number = container.getBoundingClientRect().top + scrollTop;
    const usablePixels: number = container.clientHeight / 100 * parallaxPercentage;
    const unusablePixels: number = imageHeight - container.clientHeight - usablePixels;
    const startPoint: number = elementTop - usablePixels - window.innerHeight;
    const endPoint = elementTop + container.clientHeight + usablePixels;
    const totalPixels = endPoint - startPoint;
    return { startPoint, endPoint, totalPixels, usablePixels, unusablePixels };
  }

  /**
   * Get image left position.
   * @param {number} containerWidth - Container width.
   * @param {number} imageWidth - Image width.
   * @param {number} positionPercentage - Position percentage.
   * @return {number} - Image left position.
   */
  private getImageLeft(containerWidth: number, imageWidth: number, positionPercentage: number): number {
    return (containerWidth - imageWidth) / 100 * positionPercentage;
  }

  /**
   * Get image top position.
   * @param {number} scrollTop - Scroll top.
   * @param {ParallaxBoundariesModel} boundaries - Parallax boundaries.
   * @param {boolean} isDisabled - true to disable parallax effect.
   * @return {number} - Image top position.
   */
  private getImageTop(scrollTop: number, boundaries: ParallaxBoundariesModel, isDisabled: boolean): number {
    const area: number = Math.max(0, Math.min(scrollTop - boundaries.startPoint, boundaries.totalPixels));
    const areaPercentage: number = 100 / boundaries.totalPixels * area;

    // if (isDisabled) {
    //   return (-boundaries.usablePixels - boundaries.unusablePixels) / 2;
    // }

    return -boundaries.usablePixels * (1 - areaPercentage / 100) - boundaries.unusablePixels / 2;
  }

  /**
   * Set image transform properties.
   * @param {HTMLImageElement} image - Image element.
   * @param {number} leftPx - Image left position.
   * @param {number} topPx - Image top position.
   */
  private setImageTransform(image: HTMLImageElement, leftPx: number, topPx: number): void {
    this.renderer.setStyle(image, 'transform', `translate(${leftPx}px, ${topPx}px)`);
  }
}
