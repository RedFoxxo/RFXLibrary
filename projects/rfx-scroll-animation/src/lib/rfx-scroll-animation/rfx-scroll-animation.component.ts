import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimationExpInterface } from '../animation/animation-exp.interface';
import { AnimationTypeEnum } from '../animation/animation-type.enum';
import { AnimationVisibilityEnum } from '../animation/animation-visiblity.enum';
import { RfxScrollAnimationService } from '../rfx-scroll-animation.service';

@Component({
  selector: '[libRfxScrollAnimation]',
  templateUrl: './rfx-scroll-animation.component.html',
  styleUrls: ['./rfx-scroll-animation.component.less'],
  animations: [
    trigger('visibility', [
      state('visible', style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: '{{ currentTransition }}'
      }), { params: { currentTransition: 'translate3d(0, 0, 0) scale(1)' }}),
      transition('visible <=> hidden', [
        animate('{{ transitionDurationMs }}ms {{ transitionDelayMs }}ms {{ transitionTimingFunction }}')
      ], { params: { transitionDurationMs: 0, transitionDelayMs: 0, transitionTimingFunction: 'ease' }})
    ])
  ]
})
export class RfxScrollAnimationComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public animationType: AnimationTypeEnum;
  @Input() public animationDistancePx: number;
  @Input() public distanceFromPageBottomPercentage: number;
  @Input() public transitionDurationMs: number;
  @Input() public transitionDelayMs: number;
  @Input() public transitionTimingFunction: string;
  @Input() public scaleRatio: number;
  @Input() public isOnlyFirstTime: boolean;
  @Output() public elementVisibleChange: EventEmitter<boolean>;

  private scrollListenerSubscription!: Subscription;
  private routerListenerSubscription!: Subscription;

  public animationVisibility: AnimationVisibilityEnum;
  public currentTransition: string;

  @HostBinding('@visibility')
  get visibility(): AnimationExpInterface {
    return {
      value: this.animationVisibility,
      params: {
        currentTransition: this.currentTransition,
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
    this.distanceFromPageBottomPercentage = 20;
    this.transitionDurationMs = 500;
    this.transitionDelayMs = 0;
    this.transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.scaleRatio = 1.5;
    this.isOnlyFirstTime = true;
    this.elementVisibleChange = new EventEmitter<boolean>();
    this.currentTransition = 'translate3d(0, 0, 0) scale(1)';
    this.animationVisibility = AnimationVisibilityEnum.HIDDEN;
  }

  public ngOnInit(): void {
    this.subscribeToScrollEvent();

    setTimeout(() => {
      this.onMouseScroll();
    });
  }

  public ngOnDestroy(): void {
    this.scrollListenerSubscription?.unsubscribe();
    this.routerListenerSubscription?.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.animationType?.currentValue !== undefined ||
      changes?.animationDistancePx?.currentValue !== undefined ||
      changes?.scaleRatio?.currentValue !== undefined
    ) {
      this.currentTransition = this.getCurrentTransition(
        this.animationType,
        this.animationDistancePx,
        this.scaleRatio
      );
    }
  }

  private subscribeToScrollEvent(): void {
    this.scrollListenerSubscription = this.rfxScrollAnimationService.getMouseScroll().subscribe(() => this.onMouseScroll());
  }

  // private subscribeToRouterEvent(): void {
  //   this.routerListenerSubscription = this.rfxScrollAnimationService.getNavigationEnd().subscribe(() => this.onRouterNavigationEnd());
  // }

  private getCurrentTransition(animationType: AnimationTypeEnum, animationDistancePx: number = 0, scaleRatio: number = 1): string {
    switch (animationType) {
      case AnimationTypeEnum.TOP:
        return `translate3d(0, -${animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.BOTTOM:
        return `translate3d(0, ${animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.LEFT:
        return `translate3d(-${animationDistancePx}px, 0, 0) scale(1)`;
      case AnimationTypeEnum.RIGHT:
        return `translate3d(${animationDistancePx}px, 0, 0) scale(1)`;
      case AnimationTypeEnum.ZOOM:
        return `translate3d(0, 0, 0) scale(${scaleRatio})`;
      default:
        return 'translate3d(0, 0, 0) scale(1)';
    }
  }

  private isElementInVisibleArea(element: HTMLElement, distanceFromPageBottomPercentage: number): boolean {
    const scrollBottom: number = window.scrollY + window.innerHeight;
    const distanceInPx: number = (window.innerHeight / 100) * distanceFromPageBottomPercentage;
    const rect: DOMRect = element.getBoundingClientRect();
    const scrollBottomWithDistance: number = rect.top + window.pageYOffset - document.documentElement.clientTop + distanceInPx; // TODO: check if its working with custom scrollbar
    return scrollBottom >= scrollBottomWithDistance;
  }

  private onMouseScroll(): void {
    const isElementInVisibleArea: boolean = this.isElementInVisibleArea(this.htmlElement.nativeElement, this.distanceFromPageBottomPercentage);

    if (this.isOnlyFirstTime && this.animationVisibility === AnimationVisibilityEnum.VISIBLE) {
      this.scrollListenerSubscription?.unsubscribe();
    }

    if (isElementInVisibleArea && this.animationVisibility === AnimationVisibilityEnum.HIDDEN) {
      this.setVisibility(AnimationVisibilityEnum.VISIBLE);
    } else if (!isElementInVisibleArea && this.animationVisibility === AnimationVisibilityEnum.VISIBLE) {
      this.setVisibility(AnimationVisibilityEnum.HIDDEN);
    }
  }

  private setVisibility(visible: AnimationVisibilityEnum): void {
    this.animationVisibility = visible;
    this.elementVisibleChange.emit(visible === AnimationVisibilityEnum.VISIBLE);
  }

  public hideElement(): void {
    this.scrollListenerSubscription?.unsubscribe();
    this.subscribeToScrollEvent();
    this.setVisibility(AnimationVisibilityEnum.HIDDEN);
  }
}
