import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RfxScrollAnimationService } from '../rfx-scroll-animation.service';
import { visibilityAnimation } from '../animations';
import {
  AnimationExpInterface,
  AnimationTypeEnum,
  AnimationVisibilityEnum
} from '../models';

@Component({
  selector: '[libRfxScrollAnimation]',
  templateUrl: './rfx-scroll-animation.component.html',
  styleUrls: ['./rfx-scroll-animation.component.less'],
  animations: [
    visibilityAnimation
  ]
})
export class RfxScrollAnimationComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
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

  // @Input() public distanceFromPageBottomPercentage: number;
  // @Input() public isOnlyFirstTime: boolean;
  // @Output() public elementVisibleChange: EventEmitter<boolean>;

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
   * Subscription to page readiness status.
   * @returns {void}
   */
  private routerListenerSubscription: Subscription | undefined;

  /**
   * Animation visibility status.
   * Can be 'HIDDEN' or 'VISIBLE'.
   * @type {AnimationVisibilityEnum}
   */
  private animationVisibility: AnimationVisibilityEnum;

  /**
   * Current transform value.
   * @type {string}
   */
  private currentTransform: string;


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
    // private htmlElement: ElementRef,
    private rfxScrollAnimationService: RfxScrollAnimationService
  ) {
    this.animationType = AnimationTypeEnum.NONE;
    this.animationDistancePx = 25;
    this.scaleRatio = 1.5;
    this.transitionDurationMs = 500;
    this.transitionDelayMs = 0;
    this.transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';


    // this.distanceFromPageBottomPercentage = 20;
    // this.isOnlyFirstTime = true;
    // this.elementVisibleChange = new EventEmitter<boolean>();
    this.currentTransform = 'translate(0, 0) scale(1)';
    this.animationVisibility = AnimationVisibilityEnum.HIDDEN;
  }

  public ngOnInit(): void {
    this.subscribeToHeightEvent();
    this.subscribeToScrollEvent();
  }

  public ngAfterViewInit(): void {
    // TODO CALCULATE POSITION
    this.animationVisibility = AnimationVisibilityEnum.VISIBLE;
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

  public onHeightEvent(height: number) {
    // console.warn(height);
  }

  public onScrollEvent(scroll: number) {
    // console.warn(scroll);
  }


  // private onRouterEvent(isReady: boolean): void {
  //   if (isReady) {
  //     setTimeout(() => { this.onMouseScroll() })
  //   }
  // }

  public ngOnDestroy(): void {
    this.heightListenerSubscription?.unsubscribe();
    this.scrollListenerSubscription?.unsubscribe();
    this.routerListenerSubscription?.unsubscribe();
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
   * Get current transform value.
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

  // private isElementInVisibleArea(element: HTMLElement, distanceFromPageBottomPercentage: number): boolean {
  //   const scrollBottom: number = window.scrollY + window.innerHeight;
  //   const distanceInPx: number = (window.innerHeight / 100) * distanceFromPageBottomPercentage;
  //   const rect: DOMRect = element.getBoundingClientRect();
  //   const scrollBottomWithDistance: number = rect.top + window.pageYOffset - document.documentElement.clientTop + distanceInPx;
  //   return scrollBottom >= scrollBottomWithDistance;
  // }

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

  // private setVisibility(visible: AnimationVisibilityEnum): void {
  //   this.animationVisibility = visible;
  //   this.elementVisibleChange.emit(visible === AnimationVisibilityEnum.VISIBLE);
  // }

  // public hideElement(): void {
  //   this.scrollListenerSubscription?.unsubscribe();
  //   this.subscribeToScrollEvent();
  //   this.setVisibility(AnimationVisibilityEnum.HIDDEN);
  // }
}
