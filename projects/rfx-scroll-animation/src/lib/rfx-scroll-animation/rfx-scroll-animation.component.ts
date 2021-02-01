import { state, style, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AnimationExpressionInterface } from '../animation-expression.enum';
import { AnimationTypeEnum } from '../animation-type.enum';

@Component({
  selector: '[libRfxScrollAnimation]',
  templateUrl: './rfx-scroll-animation.component.html',
  styleUrls: ['./rfx-scroll-animation.component.less'],
  animations: [
    trigger('visiblity', [
      // style({
      //   opacity: 0,
      //   transition: `
      //     opacity {{ transitionDurationMs }}ms {{ transitionTimingFunction }},
      //     transform {{ transitionDurationMs }}ms {{ transitionTimingFunction }}
      //   `
      // }),
      state('visible', style({
        opacity: 1,
        transform: '{{ currentTransition }}'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translate3d(0, 0, 0)'
      }))
    ])
  ]
})
export class RfxScrollAnimationComponent implements OnChanges {
  @Input() public animationType: AnimationTypeEnum;
  @Input() public animationDistancePx: number;
  @Input() public distanceFromPageBottomPercentage: number;
  @Input() public transitionDurationMs: number;
  @Input() public transitionDelayMs: number;
  @Input() public transitionTimingFunction: string;
  @Input() public scaleRatio: number;
  @Input() public isOnlyFirstTime: boolean;
  @Output() public elementVisibleChange: EventEmitter<boolean>;

  // private elementVisible: boolean;
  // private onScrollListener!: Subscription;

  public visiblityAnimation: AnimationExpressionInterface;

  public currentTransition: string;

  public stateTemp = 'hidden';

  constructor(
    // private renderer: Renderer2,
    // private changeDetectorRef: ChangeDetectorRef,
    // private rfxScrollAnimationService: RfxScrollAnimationService
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
    this.visiblityAnimation = {
      value: false,
      params: {
        currentTransition: this.currentTransition,
        transitionTimingFunction: this.transitionTimingFunction,
        transitionDurationMs: this.transitionDurationMs,
        transitionDelayMs: this.transitionDelayMs,
        scaleRatio: this.scaleRatio
      }
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.animationType?.currentValue !== undefined ||
      changes?.animationDistancePx?.currentValue !== undefined ||
      changes?.scaleRatio?.currentValue !== undefined
    ) {
      this.currentTransition = this.getCurrentTransition(changes.animationType.currentValue);
      this.visiblityAnimation.value = 'false';
    }
  }

  private getCurrentTransition(animationType: AnimationTypeEnum): string {
    switch (animationType) {
      case AnimationTypeEnum.TOP:
        return `translate3d(0, -${this.animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.BOTTOM:
        return `translate3d(0, ${this.animationDistancePx}px, 0) scale(1)`;
      case AnimationTypeEnum.LEFT:
        return `translate3d(-${this.animationDistancePx}px, 0, 0) scale(1)`;
      case AnimationTypeEnum.RIGHT:
        return `translate3d(${this.animationDistancePx}px, 0, 0) scale(1)`;
      case AnimationTypeEnum.ZOOM:
        return `translate3d(0, 0, 0) scale(${this.scaleRatio})`;
      default:
        return 'translate3d(0, 0, 0) scale(1)';
    }
  }
}
