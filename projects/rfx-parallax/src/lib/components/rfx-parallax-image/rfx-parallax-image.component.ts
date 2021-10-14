import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResizeEventService, ScrollEventService } from '../../services';
import { ParallaxBoundariesModel, ElementDimensionsModel } from '../../models';
import { visibilityAnimation } from '../../animations';
import { ParallaxUtilsHelper } from '../../helpers';

@Component({
  selector: '[libRfxParallaxImage]',
  templateUrl: './rfx-parallax-image.component.html',
  styleUrls: ['./rfx-parallax-image.component.less'],
  animations: [
    visibilityAnimation
  ]
})
export class RfxParallaxImageComponent implements OnInit, OnChanges {
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
  public isOverflowVisible: boolean;

  /**
   * Disable image parallax effect and
   * restore default image position.
   * Useful on low performance devices.
   * @type {boolean}
   */
  @Input()
  public isDisabled: boolean;

  /**
   * Force image to be 100% of container width.
   * @type {boolean}
   */
  @Input()
  public isAdaptiveDisabled: boolean;

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
    private resizeEventService: ResizeEventService,
    public parallaxUtilsHelper: ParallaxUtilsHelper
  ) {
    this.parallaxPercentage = 40;
    this.positionPercentage = 50;
    this.imageZIndex = -1;
    this.isDisabled = false;
    this.isOverflowVisible = false;
    this.imageLeftPx = 0;
    this.isLoaded = false;
    this.isAdaptiveDisabled = false;
  }

  /**
   * Set container position and overflow.
   * If parallax is not disabled, create listeners.
   */
  public ngOnInit(): void {
    if (this.parallaxUtilsHelper.isBrowser) {
      this.setContainerPosition(this.htmlElement.nativeElement);
      this.setContainerOverflow(this.htmlElement.nativeElement, this.isOverflowVisible);

      if (!this.isDisabled) {
        this.createListeners();
      }
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
    if (this.parallaxUtilsHelper.isBrowser) {
      if (this.parallaxUtilsHelper.isValueChanged(changes.isDisabled, true)) {
        this.destroyListeners();
      } else if (this.parallaxUtilsHelper.isValueChanged(changes.isDisabled, false)) {
        this.createListeners();
      }

      if (this.parallaxUtilsHelper.isValueChanged(changes.visibleOverflow)) {
        this.setContainerOverflow(this.htmlElement.nativeElement, changes.visibleOverflow.currentValue);
      }

      if (this.image && (
        this.parallaxUtilsHelper.isAtLeastOneValueChanged(
          changes.imageUrl,
          changes.parallaxPercentage,
          changes.positionPercentage,
          changes.isDisabled,
          changes.forceFullWidth)
      )) {
        this.setImageProperties(this.image);
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroyListeners();
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
      const topPx: number = this.parallaxUtilsHelper.getImageTopPosition(this.parallaxBoundaries, scroll);
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
   * Set image object and loading status.
   * Set image properties after image is fully loaded
   * but only if platform is browser.
   * @param {Event} event - Image loaded event.
   */
  public onImageLoaded(event: Event): void {
    this.image = event.target as HTMLImageElement;

    if (this.parallaxUtilsHelper.isBrowser) {
      this.setImageProperties(this.image);
    }

    this.isLoaded = true;
  }

  /**
   * Set image properties needed for parallax effect.
   * @param {HTMLImageElement} image - Image to be parallaxed.
   */
  private setImageProperties(image: HTMLImageElement): void {
    const scrollTop: number = this.scrollEventService.getMouseScrollValue();

    const imageDimensions: ElementDimensionsModel = this.parallaxUtilsHelper.getImageSize(
      image,
      this.htmlElement.nativeElement.clientWidth,
      this.htmlElement.nativeElement.clientHeight,
      this.parallaxPercentage,
      this.isDisabled,
      this.isAdaptiveDisabled
    );

    this.setImageSize(image, imageDimensions);

    this.parallaxBoundaries = this.parallaxUtilsHelper.getParallaxBoundaries(
      scrollTop,
      this.htmlElement.nativeElement,
      image.height,
      this.parallaxPercentage
    );

    this.imageLeftPx = this.parallaxUtilsHelper.getImageLeftPositionPx(
      this.htmlElement.nativeElement.clientWidth,
      image.width,
      this.positionPercentage
    );

    const topPx: number = this.isDisabled ?
      this.parallaxUtilsHelper.getImageTopPositionDisabled(this.parallaxBoundaries) :
      this.parallaxUtilsHelper.getImageTopPosition(this.parallaxBoundaries, scrollTop);

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
   * Set image size based on image and container dimensions.
   * @param {HTMLImageElement} image - image to be parallaxed.
   * @param {ElementDimensionsModel} imageDimensions - image dimensions
   */
  private setImageSize(image: HTMLImageElement, imageDimensions: ElementDimensionsModel): void {
    this.renderer.setAttribute(image, 'width', imageDimensions.width);
    this.renderer.setAttribute(image, 'height', imageDimensions.height);
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
