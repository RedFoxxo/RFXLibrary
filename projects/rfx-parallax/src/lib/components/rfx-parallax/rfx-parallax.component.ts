import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResizeEventService, ScrollEventService } from '../../services';
import { ParallaxBoundariesModel } from '../../models';
import { visibilityAnimation } from '../../animations';

@Component({
  selector: '[libRfxParallax]',
  templateUrl: './rfx-parallax.component.html',
  styleUrls: ['./rfx-parallax.component.less'],
  animations: [
    visibilityAnimation
  ]
})
export class RfxParallaxComponent implements OnInit, OnChanges {
  /**
   * Image url.
   * Can be http(s) or relative path.
   * TODO: Add support for fallback.
   * @type {string}
   */
  @Input()
  public imageUrl: string | undefined;

  /**
   * Image alt attribute.
   * @type {string}
   */
  @Input()
  public imageAlt: string | undefined;

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
   * Subscription to resize event.
   * @type {Subscription | undefined}
   */
  private resizeEventListener: Subscription | undefined;

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

  /**
   * Is image loaded.
   * @type {boolean}
   */
  public isLoaded: boolean;


  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private scrollEventService: ScrollEventService,
    private resizeEventService: ResizeEventService
  ) {
    this.parallaxPercentage = 40;
    this.positionPercentage = 50;
    this.imageZIndex = -1;
    this.isDisabled = false;
    this.visibleOverflow = false;
    this.imageLeftPx = 0;
    this.isLoaded = false;
  }

  /**
   * Set container position and overflow.
   * If parallax is not disabled, create listeners.
   */
  public ngOnInit(): void {
    this.setContainerPosition(this.htmlElement.nativeElement);
    this.setContainerOverflow(this.htmlElement.nativeElement, this.visibleOverflow);

    if (!this.isDisabled) {
      this.createListeners();
    }
  }

  /**
   * Update parallax values when some properies changed.
   * - isDisabled change, enable or disable parallax and refresh image properties.
   * - visibleOverflow change, show or hide image overflow on container without refresh.
   * - imagerUrl, parallaxPercentage or positionPercentage change, refresh image properties.
   * @param {SimpleChanges} changes - SimpleChanges object.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.hasValueChanged(changes.isDisabled, true)) {
      this.destroyListeners();
    } else if (this.hasValueChanged(changes.isDisabled, false)) {
      this.createListeners();
    }

    if (this.hasValueChanged(changes.visibleOverflow)) {
      this.setContainerOverflow(this.htmlElement.nativeElement, changes.visibleOverflow.currentValue);
    }

    if (this.image && ((
      this.hasValueChanged(changes.imageUrl) ||
      this.hasValueChanged(changes.parallaxPercentage) ||
      this.hasValueChanged(changes.positionPercentage)) ||
      this.hasValueChanged(changes.isDisabled))) {
      this.setImageProperties(this.image);
    }
  }

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  /**
   * Check if SimpleChange value has changed.
   * Eventually check if value corresponds to a new value.
   * @param {SimpleChange} change - SimpleChange object.
   * @param {any} newValue - New value.
   * @returns {boolean} - true if value has changed.
   */
  private hasValueChanged(change: SimpleChange, newValue: any = change?.currentValue): boolean {
    return change?.firstChange === false && change?.currentValue !== undefined && change?.currentValue === newValue;
  }

  /**
   * Destroy all listeners.
   */
  private destroyListeners(): void {
    this.scrollEventListener?.unsubscribe();
    this.resizeEventListener?.unsubscribe();
  }

  /**
   * Listen to scroll and resize events.
   * Destroy alreay existing listeners.
   */
  private createListeners(): void {
    this.destroyListeners();

    this.scrollEventListener = this.scrollEventService.getMouseScroll().subscribe(
      (scroll: number) => this.onMouseScroll(scroll)
    );

    this.resizeEventListener = this.resizeEventService.getResize().subscribe(
      () => this.onResize()
    );
  }

  /**
   * On mouse scroll event recalculate and change
   * parallaxed image position.
   * @param {number} scroll - Scroll value.
   */
  private onMouseScroll(scroll: number): void {
    if (this.parallaxBoundaries && this.image) {
      const topPx: number = this.getImageTop(scroll, this.parallaxBoundaries);
      this.setImageTransform(this.image, this.imageLeftPx, topPx);
    }
  }

  /**
   * On window resize event reload parallax properties.
   */
  private onResize(): void {
    if (this.image) {
      this.setImageProperties(this.image);
    }
  }

  /**
   * Set image properties after image is fully loaded.
   * @param {Event} event - Image loaded event.
   */
  public onImageLoaded(event: Event): void {
    this.image = event.target as HTMLImageElement;
    this.setImageProperties(this.image);
    this.isLoaded = true;
  }

  /**
   * Set image properties needed for parallax effect.
   * @param {HTMLImageElement} image - Image to be parallaxed.
   */
  private setImageProperties(image: HTMLImageElement): void {
    const scrollTop: number = this.scrollEventService.getMouseScrollValue();

    this.setImageSize(
      image,
      this.htmlElement.nativeElement.clientWidth,
      this.htmlElement.nativeElement.clientHeight,
      this.parallaxPercentage,
      this.isDisabled
    );

    this.parallaxBoundaries = this.getParallaxBoundaries(
      scrollTop,
      this.htmlElement.nativeElement,
      image.height,
      this.parallaxPercentage
    );

    this.imageLeftPx = this.getImageLeft(
      this.htmlElement.nativeElement.clientWidth,
      image.width,
      this.positionPercentage
    );

    const topPx: number = this.isDisabled ?
      this.getDisabledImageTop(this.parallaxBoundaries) :
      this.getImageTop(scrollTop, this.parallaxBoundaries);

    this.setImageTransform(image, this.imageLeftPx, topPx);
  }

  /**
   * Set container position to relative
   * if image is not already in relative or absolute position.
   * @param {HTMLElement} container
   */
  private setContainerPosition(container: HTMLElement): void {
    const position: string = getComputedStyle(container).position;
    if (position !== 'relative' && position !== 'absolute') {
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
   * @return {ParallaxBoundariesModel} - Parallax boundaries.
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
   * @return {number} - Image top position.
   */
  private getImageTop(scrollTop: number, boundaries: ParallaxBoundariesModel): number {
    const area: number = Math.max(0, Math.min(scrollTop - boundaries.startPoint, boundaries.totalPixels));
    const areaPercentage: number = 100 / boundaries.totalPixels * area;
    return -boundaries.usablePixels * (1 - areaPercentage / 100) - boundaries.unusablePixels / 2;
  }

  /**
   * Get disabled image top position.
   * @param {number} boundaries - Parallax boundaries.
   * @return {number} - Image top position.
   */
  private getDisabledImageTop(boundaries: ParallaxBoundariesModel): number {
    return (-boundaries.usablePixels - boundaries.unusablePixels) / 2
  }

  /**
   * Set image transform properties.
   * @param {HTMLImageElement} image - Image element.
   * @param {number} leftPx - Image left position.
   * @param {number} topPx - Image top position.
   */
  private setImageTransform(image: HTMLImageElement, leftPx: number, topPx: number): void {
    const newTranslate: string = `translate(${leftPx.toFixed(1)}px, ${topPx.toFixed(1)}px)`;

    if (image.style.transform !== newTranslate) {
      this.renderer.setStyle(image, 'transform', newTranslate);
    }
  }
}
