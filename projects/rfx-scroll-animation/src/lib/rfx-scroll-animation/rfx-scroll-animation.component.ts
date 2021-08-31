import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxScrollAnimationService } from '../rfx-scroll-animation.service';
import { visibilityAnimation } from '../animations';
import { AnimationExpInterface, AnimationTypeEnum, AnimationVisibilityEnum, VisibilityRangeModel } from '../models';

@Component({
  selector: '[libRfxScrollAnimation]',
  templateUrl: './rfx-scroll-animation.component.html',
  styleUrls: ['./rfx-scroll-animation.component.less'],
  animations: [
    visibilityAnimation
  ]
})
export class RfxScrollAnimationComponent implements AfterViewInit, OnChanges, OnDestroy {
  /**
   * Element animation type.
   * Default is NONE.
   * Must be 'NONE' if you want to implement custom animation.
   * @type {AnimationTypeEnum}
   */
  @Input()
  public animationType: AnimationTypeEnum | string;

  /**
   * Element animation shift from correct position.
   * If zero, there is no animation.
   * Default is 25px.
   * @type {number}
   */
  @Input()
  public animationDistancePx: number;

  /**
   * Zoom animation ratio.
   * Can be positive or negative.
   * Default is 1.5.
   * @type {number}
   */
  @Input()
  public scaleRatio: number;

  /**
   * Animation transition duration in milliseconds.
   * Must be more or equal to zero.
   * If zero, there is no animation.
   * Default is 500.
   * @type {number}
   */
  @Input()
  public transitionDurationMs: number;

  /**
   * Animation transition delay in milliseconds.
   * Must be more or equal to zero.
   * If zero, there is no delay.
   * Default is 0.
   * @type {number}
   */
  @Input()
  public transitionDelayMs: number;

  /**
   * Animation timing function
   * Default is 'cubic-bezier(0.4, 0.0, 0.2, 1)'.
   * @type {string}
   */
  @Input()
  public transitionTimingFunction: string;

  /**
   * How much space (in percentage) from the bottom of the page
   * before the element is considered to be visible.
   * @type {number}
   */
  @Input()
  public distanceFromPageBottomPercentage: number;

  /**
   * How much space (in percentage) from the top of the page
   * before the element is considered to be hidden.
   * Works only if isOnlyFirstTime is false.
   * @type {number}
   */
  @Input()
  public distanceFromPageTopPercentage: number;

  // @Input() public isOnlyFirstTime: boolean;

  /**
   * Emit element visibility change event.
   * @param {boolean} isVisible
   */
  @Output()
  public elementVisibleChange: EventEmitter<boolean>;

  /**
   * Subscription to body height changes.
   * @type {Subscription}
   */
  private heightListenerSubscription: Subscription | undefined;

  /**
   * Subscription to scroll value changes.
   * @type {Subscription}
   */
  private scrollListenerSubscription: Subscription | undefined;

  /**
   * Animation visibility status.
   * Can be 'HIDDEN' or 'VISIBLE'.
   * @type {AnimationVisibilityEnum}
   */
  private animationVisibility: AnimationVisibilityEnum;

  /**
   * Current transform value.
   * Default is 'translate(0, 0) scale(1)'.
   * @type {string}
   */
  private currentTransform: string;

  /**
   * Is page ready to animate elements.
   * Default is false.
   */
  private isPageReady: boolean;

  /**
   * Registered element index.
   * @type {number}
   */
  public elementIndex: number;

  /**
   * Element visibility range.
   * @type {VisibilityRangeModel}
   */
  private visibilityRange: VisibilityRangeModel | undefined;

  @Input() test!: boolean;


  /**
   * Bind visibility animation to host element.
   */
  @HostBinding('@visibility')
  get visibility(): AnimationExpInterface | null {
    return this.animationType === AnimationTypeEnum.NONE ? null : {
      value: this.animationVisibility,
      params: {
        currentTransform: this.currentTransform,
        transitionTimingFunction: this.transitionTimingFunction,
        transitionDurationMs: this.transitionDurationMs,
        transitionDelayMs: this.transitionDelayMs,
        scaleRatio: this.scaleRatio
      }
    }
  }

  constructor(
    private htmlElement: ElementRef,
    private rfxScrollAnimationService: RfxScrollAnimationService
  ) {
    this.animationType = AnimationTypeEnum.NONE;
    this.animationDistancePx = 25;
    this.scaleRatio = 1.5;
    this.transitionDurationMs = 500;
    this.transitionDelayMs = 0;
    this.transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.distanceFromPageBottomPercentage = 20;
    this.distanceFromPageTopPercentage = 20;
    this.elementVisibleChange = new EventEmitter<boolean>();

    // this.isOnlyFirstTime = true;

    this.currentTransform = 'translate(0, 0) scale(1)';
    this.animationVisibility = AnimationVisibilityEnum.HIDDEN;
    this.isPageReady = false;
    this.elementIndex = this.rfxScrollAnimationService.registerElement(this);
  }

  public ngAfterViewInit(): void {
    this.subscribeToHeightEvent();
    this.subscribeToScrollEvent();
    this.subscribeToPageReadyEvent();
    this.rfxScrollAnimationService.setElementReady(this.elementIndex);
  }

  /**
   * Subscribe to height change event.
   * @returns {void}
   */
  private subscribeToHeightEvent(): void {
    this.heightListenerSubscription = this.rfxScrollAnimationService.getBodyHeight().subscribe(
      (height: number) => this.onHeightEvent(height)
    );
  }

  /**
   * Subscribe to scroll change event.
   * @returns {void}
   */
  private subscribeToScrollEvent(): void {
    this.scrollListenerSubscription = this.rfxScrollAnimationService.getMouseScroll().subscribe(
      (scroll: number) => this.onScrollEvent(scroll)
    );
  }

  /**
   * Subscribe to page ready flag event.
   * If page is ready, calculate element visiblity range.
   * @returns {void}
   */
  private subscribeToPageReadyEvent(): void {
    this.rfxScrollAnimationService.getPageReady().subscribe(
      (isReady: boolean) => {
        if (isReady) {
          this.isPageReady = true;
          this.calculateVisibilityRange();
        }
      }
    );
  }

  /**
   * Calculate element visibility range, assign it to visibilityRange
   * property and trigger manually scroll event.
   */
  public calculateVisibilityRange(): void {
    const windowHeightPx: number = window.innerHeight;
    const bodyHeightPx: number = this.rfxScrollAnimationService.getBodyHeightValue();

    this.visibilityRange = this.getVisibilityRange(
      this.htmlElement.nativeElement,
      windowHeightPx,
      bodyHeightPx,
      this.distanceFromPageBottomPercentage,
      this.distanceFromPageTopPercentage
    );

    this.onScrollEvent(
      this.rfxScrollAnimationService.getMouseScrollValue()
    );
  }

  /**
   * Get range in which element is visible in pixels.
   * @param {HTMLElement} element - Element to check.
   * @param {number} distanceFromPageBottomPercentage - Distance from page bottom in percentage.
   * @returns {VisibilityRangeModel} - Visibility range.
   */
  private getVisibilityRange(
    element: HTMLElement,
    windowHeight: number,
    bodyHeight: number,
    distanceFromPageBottomPercentage: number,
    distanceFromPageTopPercentage: number
  ): VisibilityRangeModel {
    const elementRect: DOMRect = element.getBoundingClientRect();

    // const topDistancePx: number = windowHeight * distanceFromPageTopPercentage / 100;
    const bottomDistancePx: number = windowHeight * distanceFromPageBottomPercentage / 100;

    // const topLimitPx: number = elementRect.top - topDistancePx;
    const bottomLimitPx: number = elementRect.top - windowHeight + bottomDistancePx;

    // console.warn(
    //   '\ntop:', topLimitPx,
    //   '\nbottom:', bottomLimitPx
    // //   Math.max(0, startPx),
    // //   endPx
    // );

    return {
      topLimit: NaN, // Math.max(0, startPx),
      bottomLimit: bottomLimitPx
    };
  }

  // private isElementInVisibleArea(element: HTMLElement, distanceFromPageBottomPercentage: number): boolean {
  //   const scrollBottom: number = window.scrollY + window.innerHeight;
  //   const distanceInPx: number = (window.innerHeight / 100) * distanceFromPageBottomPercentage;
  //   const rect: DOMRect = element.getBoundingClientRect();
  //   const scrollBottomWithDistance: number = rect.top + window.pageYOffset - document.documentElement.clientTop + distanceInPx;
  //   return scrollBottom >= scrollBottomWithDistance;
  // }

  public ngOnDestroy(): void {
    this.heightListenerSubscription?.unsubscribe();
    this.scrollListenerSubscription?.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.animationType?.currentValue !== undefined ||
      changes?.animationDistancePx?.currentValue !== undefined ||
      changes?.scaleRatio?.currentValue !== undefined
    ) {
      this.currentTransform = this.getCurrentTransform(
        this.animationType,
        this.animationDistancePx,
        this.scaleRatio
      );
    }
  }

  /**
   * Retuns current transform value based on animation type, distance and scale ratio.
   * @param {AnimationTypeEnum} animationType - Animation type.
   * @param {number} animationDistancePx - Animation distance in pixels.
   * @param {number} scaleRatio - Scale ratio.
   * @returns {string}
   */
  private getCurrentTransform(animationType: AnimationTypeEnum | string, animationDistancePx: number = 0, scaleRatio: number = 1): string {
    switch (animationType) {
      case AnimationTypeEnum.TOP:
        return `translate(0, -${animationDistancePx}px) scale(1)`;
      case AnimationTypeEnum.BOTTOM:
        return `translate(0, ${animationDistancePx}px) scale(1)`;
      case AnimationTypeEnum.LEFT:
        return `translate(-${animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.RIGHT:
        return `translate(${animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.ZOOM:
        return `translate(0, 0) scale(${scaleRatio})`;
      default:
        return 'translate(0, 0) scale(1)';
    }
  }

  private onHeightEvent(height: number) {
    // TODO: RECALCULATE ANIMATION POSITION
    // console.warn(height);
  }

  private onScrollEvent(scroll: number) {
    if (this.isPageReady && this.visibilityRange) {
      const visibility: AnimationVisibilityEnum = this.getVisibility(scroll, this.visibilityRange);


      if (visibility !== this.animationVisibility) {
        // console.warn(scroll, this.visibilityRange, visibility);
        this.setVisibility(visibility);

      }
    }
  }

  // private onMouseScroll(): void {
  //   const isElementInVisibleArea: boolean = this.isElementInVisibleArea(this.htmlElement.nativeElement, this.distanceFromPageBottomPercentage);

  //   if (this.isOnlyFirstTime && this.animationVisibility === AnimationVisibilityEnum.VISIBLE) {
  //     this.scrollListenerSubscription?.unsubscribe();
  //   }

  //   if (isElementInVisibleArea && this.animationVisibility === AnimationVisibilityEnum.HIDDEN) {
  //     this.setVisibility(AnimationVisibilityEnum.VISIBLE);
  //   } else if (!isElementInVisibleArea && this.animationVisibility === AnimationVisibilityEnum.VISIBLE) {
  //     this.setVisibility(AnimationVisibilityEnum.HIDDEN);
  //   }
  // }

  /**
   * Get visibility state.
   * @param {number} scroll - Scroll position.
   * @param {VisibilityRangeModel} visibilityRange - Visibility range.
   * @returns {AnimationVisibilityEnum}
   */
  private getVisibility(scroll: number = window.scrollY, visibilityRange: VisibilityRangeModel): AnimationVisibilityEnum {
    const isVisible: boolean = scroll >= visibilityRange.bottomLimit;
    return isVisible ? AnimationVisibilityEnum.VISIBLE : AnimationVisibilityEnum.HIDDEN;
  }

  /**
   * Set element visiblity.
   * @param {AnimationVisibilityEnum} visibility - Visibility value.
   * @returns {void}
   */
  private setVisibility(visible: AnimationVisibilityEnum): void {
    this.animationVisibility = visible;
    this.elementVisibleChange.emit(visible === AnimationVisibilityEnum.VISIBLE);
  }
}
