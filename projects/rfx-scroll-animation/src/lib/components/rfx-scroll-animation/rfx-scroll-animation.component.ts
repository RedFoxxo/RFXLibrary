import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElementsManagementService, ScrollEventService, ResizeEventService, HeightEventService } from '../../services';
import { visibilityAnimation } from '../../animations';
import { AnimationExpInterface, AnimationTypeEnum, AnimationVisibilityEnum, SectionAreaModel } from '../../models';


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
   * If true, element appears only once and never hides.
   * Default is true.
   * @type {boolean}
   */
  @Input()
  public isOnlyFirstTime: boolean;

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
   * Subscription to window resize changes.
   * @type {Subscription}
   */
  private resizeListenerSubscription: Subscription | undefined;

  /**
   * Subscription to elements ready value changes.
   * @type {Subscription}
   */
  private elementsReadyListenerSubscription: Subscription | undefined;

  /**
   * Animation visibility status.
   * Can be 'HIDDEN' or 'VISIBLE'.
   * @type {AnimationVisibilityEnum}
   */
  private animationVisibility: AnimationVisibilityEnum;

  /**
   * Animation will change value.
   */
  private animationWillChange: boolean;

  /**
   * Current transform value.
   * Default is 'translate(0, 0) scale(1)'.
   * @type {string}
   */
  private currentTransform: string;

  /**
   * Current page height in pixels.
   * @type {number}
   */
  private currentPageHeight: number;

  /**
   * Is page ready to animate elements.
   * Default is false.
   */
  private isPageReady: boolean;

  /**
   * Registered element index inside service.
   * @type {number}
   */
  public elementIndex: number;

  /**
   * Value where the element is considered to be visible.
   * @type {number | undefined}
   */
  private visibilityBarrier: number | undefined;

  /**
   * Values where the element have will-change property.
   * @type {SectionAreaModel | undefined}
   */
  private willChangeArea: SectionAreaModel | undefined;

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
    private renderer: Renderer2,
    private scrollEventService: ScrollEventService,
    private heightEventService: HeightEventService,
    private resizeEventService: ResizeEventService,
    private elementsManagementService: ElementsManagementService
  ) {
    this.animationType = AnimationTypeEnum.NONE;
    this.animationDistancePx = 25;
    this.scaleRatio = 1.5;
    this.transitionDurationMs = 500;
    this.transitionDelayMs = 0;
    this.transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.distanceFromPageBottomPercentage = 20;
    this.isOnlyFirstTime = true;
    this.elementVisibleChange = new EventEmitter<boolean>();
    this.currentTransform = 'translate(0, 0) scale(1)';
    this.animationVisibility = AnimationVisibilityEnum.HIDDEN;
    this.animationWillChange = true;
    this.currentPageHeight = 0;
    this.isPageReady = false;
    this.elementIndex = this.elementsManagementService.registerElement(this);
  }

  public ngAfterViewInit(): void {
    this.subscribeToResizeEvent();
    this.subscribeToHeightEvent();
    this.subscribeToScrollEvent();
    this.subscribeToElementsReadyEvent();
    this.elementsManagementService.setElementReady(this.elementIndex);
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

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  /**
   * Destroy all listeners.
   */
  private destroyListeners(): void {
    this.heightListenerSubscription?.unsubscribe();
    this.scrollListenerSubscription?.unsubscribe();
    this.resizeListenerSubscription?.unsubscribe();
    this.elementsReadyListenerSubscription?.unsubscribe();
  }

  /**
   * Subscribe to window resize event.
   * When window is resized, update element properties.
   */
  private subscribeToResizeEvent(): void {
    this.resizeListenerSubscription = this.resizeEventService.getResize().subscribe(
      () => this.calculateElementProperties()
    );
  }

  /**
   * Subscribe to height change event.
   * When height change, update element properties.
   */
  private subscribeToHeightEvent(): void {
    this.heightListenerSubscription = this.heightEventService.getHeight().subscribe(
      (height) => {
        if (this.currentPageHeight !== height) {
          this.calculateElementProperties();
        }
      }
    );
  }

  /**
   * Subscribe to scroll change event.
   */
  private subscribeToScrollEvent(): void {
    this.scrollListenerSubscription = this.scrollEventService.getMouseScroll().subscribe(
      (scroll: number) => this.onScrollEvent(scroll)
    );
  }

  /**
   * Subscribe to elements ready flag event.
   * If elements are ready, calculate element properties and destroy this listener.
   */
  private subscribeToElementsReadyEvent(): void {
    this.elementsReadyListenerSubscription = this.elementsManagementService.getElementsReady().subscribe(
      (isReady: boolean) => {
        if (isReady) {
          this.elementsReadyListenerSubscription?.unsubscribe();
          this.isPageReady = true;
          this.calculateElementProperties();
        }
      }
    );
  }

  /**
   * Calculate and set will-change area.
   * Calculate and set visibility barrier.
   * Trigger page scroll event so that element can be updated.
   */
  public calculateElementProperties(): void {
    this.visibilityBarrier = undefined;
    const windowHeightPx: number = window.innerHeight;
    const scroll: number = this.scrollEventService.getMouseScrollValue();
    this.currentPageHeight = this.heightEventService.getHeightValue();

    this.willChangeArea = this.getWillChangeArea(
      this.htmlElement.nativeElement, scroll, windowHeightPx
    );

    this.visibilityBarrier = this.getVisibilityBarrier(
      this.htmlElement.nativeElement, scroll, windowHeightPx, this.currentPageHeight, this.distanceFromPageBottomPercentage
    );

    this.onScrollEvent(scroll);
  }

  /**
   * Calculate area where element is probably going to be animated soon.
   * @param {HTMLElement} element - Element to calculate will-change area for.
   * @param {number} scroll - Current scroll value.
   * @param {number} windowHeightPx - Current window height.
   * @returns {number} - Will-change area.
   */
  private getWillChangeArea(element: HTMLElement, scroll: number, windowHeightPx: number): SectionAreaModel {
    const elementRect: DOMRect = element.getBoundingClientRect();
    const elementTop: number = elementRect.top + scroll;
    const triggerArea: number = windowHeightPx * 2;
    const areaTop: number = elementTop - triggerArea;
    const areaBottom: number = elementTop + triggerArea;
    return { top: areaTop, bottom: areaBottom };
  }

  /**
   * Get value which indicates where element is visible.
   * If bottom limit cannot be reached, force it at the very bottom of the page
   * so we can see the element.
   * @param {HTMLElement} element - Element to check.
   * @param {number} scroll - Current scroll value.
   * @param {number} windowHeightPx - Window height in pixels.
   * @param {number} pageHeightPx - Page height in pixels.
   * @param {number} distanceFromPageBottomPercentage - Distance from page bottom in percentage.
   * @returns {number} - Visibility barrier.
   */
  private getVisibilityBarrier(
    element: HTMLElement,
    scroll: number,
    windowHeightPx: number,
    pageHeightPx: number,
    distanceFromPageBottomPercentage: number
  ): number {
    const elementRect: DOMRect = element.getBoundingClientRect();
    const bottomDistancePx: number = windowHeightPx * distanceFromPageBottomPercentage / 100;
    const bottomLimitPx: number = elementRect.top + scroll - windowHeightPx + bottomDistancePx;
    const bottomPageLimitPx: number = pageHeightPx - windowHeightPx;
    return bottomLimitPx > bottomPageLimitPx ? bottomPageLimitPx : bottomLimitPx;
  }

  /**
   * Retuns current transform value based on animation type, distance and scale ratio.
   * @param {AnimationTypeEnum} animationType - Animation type.
   * @param {number} animationDistancePx - Animation distance in pixels.
   * @param {number} scaleRatio - Scale ratio.
   * @returns {string} - Current transform value.
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

  /**
   * Scroll event handler:
   * - calculate visibility
   * - destroy listeners if element is visible and is a one-shot element
   * - set element visibility if changed
   * - set will-change property if element is near the barrier value
   * @param {number} scroll - Current scroll value.
   */
  private onScrollEvent(scroll: number): void {
    if (this.isPageReady && this.visibilityBarrier !== undefined && this.willChangeArea !== undefined) {
      const visibility: AnimationVisibilityEnum = this.getVisibility(scroll, this.visibilityBarrier);

      if (this.isOnlyFirstTime && visibility === AnimationVisibilityEnum.VISIBLE) {
        this.destroyListeners();
      }

      if (visibility !== this.animationVisibility) {
        this.setVisibility(visibility);
      }

      const isElementInArea: boolean = this.isElementInArea(scroll, this.willChangeArea);

      if (!this.isOnlyFirstTime && (isElementInArea !== this.animationWillChange)) {
        this.setWillChange(isElementInArea);
      }

      if (this.isOnlyFirstTime && visibility === AnimationVisibilityEnum.VISIBLE) {
        this.setWillChange(false);
      }
    }
  }

  /**
   * Get visibility state.
   * Element is visible when scroll position crosses visibility barrier.
   * @param {number} scroll - Scroll position.
   * @param {number} visibilityBarrier - the limit where the element becomes visible.
   * @returns {AnimationVisibilityEnum}
   */
  private getVisibility(scroll: number, visibilityBarrier: number): AnimationVisibilityEnum {
    const isVisible: boolean = scroll >= visibilityBarrier;
    return isVisible ? AnimationVisibilityEnum.VISIBLE : AnimationVisibilityEnum.HIDDEN;
  }

  /**
   * Set element visiblity and emit visibility change event.
   * If animation is only first time, wait for animation to finish and remove will-change.
   * @param {AnimationVisibilityEnum} visibility - Visibility value.
   */
  public setVisibility(visible: AnimationVisibilityEnum): void {
    requestAnimationFrame(() => {
      this.animationVisibility = visible;
      this.elementVisibleChange.emit(visible === AnimationVisibilityEnum.VISIBLE);
    });
  }

  /**
   * Set element will-change property.
   * @param {boolean} willChange - will-change enabled or disabled.
   */
  private setWillChange(willChange: boolean): void {
    this.animationWillChange = willChange;
    this.renderer.setStyle(
      this.htmlElement.nativeElement,
      'will-change',
      willChange ? 'opacity, transform' : 'auto'
    );
  }

  /**
   * Check if element is in will-change area.
   * @param {number} scroll - Scroll position.
   * @param {SectionAreaModel} willChangeArea - Will-change area.
   * @returns {boolean} - Is element in will-change area.
   */
  private isElementInArea(scroll: number, willChangeArea: SectionAreaModel): boolean {
    return scroll >= willChangeArea.top && scroll <= willChangeArea.bottom;
  }
}
