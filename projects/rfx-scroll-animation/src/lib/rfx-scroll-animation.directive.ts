import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimationTypeEnum } from './animation-type.enum';
import { IRendererStyle } from './render-style.interface';
import { RfxScrollAnimationService } from './rfx-scroll-animation.service';

@Directive({
  selector: '[libRfxScrollAnimation]'
})
export class RfxScrollAnimationDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public distanceFromPageBottomPercentage: number;
  @Input() public animationType: AnimationTypeEnum;
  @Input() public animationDistancePx: number;
  @Input() public transitionDurationMs: number;
  // @Input() public transitionDelayMs: number; // PERFORMANCE ISSUES
  @Input() public transitionTimingFunction: string;
  @Input() public scaleRatio: number;
  public isOnlyFirstTime: boolean; // @Input() // NOT WORKING CORRECTLY
  @Output() public elementVisibleChange: EventEmitter<boolean>;

  private elementVisible: boolean;
  private onScrollListener!: Subscription;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private rfxScrollAnimationService: RfxScrollAnimationService
  ) {
    this.elementVisibleChange = new EventEmitter<boolean>();
    this.distanceFromPageBottomPercentage = 20;
    this.animationDistancePx = 25;
    this.transitionDurationMs = 500;
    this.transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.scaleRatio = 1.5;
    this.isOnlyFirstTime = true;
    this.elementVisible = false;
    this.animationType = AnimationTypeEnum.NONE;
  }

  public ngOnChanges(): void {
    if (this.animationType !== AnimationTypeEnum.NONE) {
      this.setInitialElementStyle();
    }
  }

  public ngOnInit(): void {
    this.toggleElementInstantly(false);

    this.rfxScrollAnimationService.getNavigationEnd().subscribe((value: boolean) => {
      if (value) {
        this.initElement();

        if (!this.isOnlyFirstTime || !this.elementVisible) {
          this.subscribeToMouseScroll();
        }
      }
    });
  }

  private subscribeToMouseScroll(): void {
    this.onScrollListener = this.rfxScrollAnimationService.getMouseScroll().subscribe(() => {
      this.onMouseScroll();
    });
  }

  public ngOnDestroy(): void {
    if (this.onScrollListener) {
      this.onScrollListener.unsubscribe();
    }
  }

  /**
   * Set html element initial state
   */
  private initElement(): void {
    const isElementInView = this.isElementInView();
    const isElementVisible = isElementInView ? isElementInView : this.isElementVisible();

    if (isElementVisible && !isElementInView) {
      this.toggleElementInstantly(true);
    } else if (isElementVisible && isElementInView) {
      this.toggleElement(true);
    }
  }

  /**
   * Set html element initial style
   */
  private setInitialElementStyle(): void {
    this.setElementStyle(
      this.htmlElement.nativeElement,
      { name: 'transition-timing-function', value: this.transitionTimingFunction },
      { name: 'transition-duration', value: `${this.transitionDurationMs}ms` },
      { name: 'transition-property', value: 'opacity, transform' }
    );
  }

  /**
   * Is element visible in the window
   */
  private isElementInView(): boolean {
    const rect: DOMRect = this.htmlElement.nativeElement.getBoundingClientRect();
    const offsetTop: number = rect.top + window.pageYOffset - document.documentElement.clientTop;
    const distanceInPx: number = (window.innerHeight / 100) * this.distanceFromPageBottomPercentage;
    const viewTop: number = window.pageYOffset + window.innerHeight - distanceInPx;
    return viewTop >= offsetTop && window.pageYOffset < offsetTop + rect.height;
  }

  /**
   * IS element visible in the document
   */
  private isElementVisible(): boolean {
    const scrollBottom: number = window.scrollY + window.innerHeight;
    const distanceInPx: number = (window.innerHeight / 100) * this.distanceFromPageBottomPercentage;
    const rectTop: number = this.htmlElement.nativeElement.getBoundingClientRect().top;
    const scrollBottomWithDistance: number = rectTop + window.pageYOffset - document.documentElement.clientTop + distanceInPx;
    return scrollBottom >= scrollBottomWithDistance;
  }

  /**
   * Set single or multiple element styles
   * @param element html element
   * @param styles single or multiple style models
   */
  private setElementStyle(element: Element, ...styles: IRendererStyle[]): void {
    styles.forEach((style) => {
      this.renderer.setStyle(element, style.name, style.value);
    });
  }

  /**
   * Remove single or multiple element styles
   * @param element html element
   * @param styles single or multiple style models (only style name is required)
   */
  private removeElementStyle(element: Element, ...styles: IRendererStyle[]): void {
    styles.forEach((style) => {
      this.renderer.removeStyle(element, style.name);
    });
  }

  /**
   * Show / hide element from page
   */
  public toggleElement(visible: boolean, restoreListener: boolean = false): void {
    this.elementVisible = visible;
    this.elementVisibleChange.emit(visible);

    this.setElementStyle(
      this.htmlElement.nativeElement,
      { name: 'opacity', value: String(+visible) },
      { name: 'transform', value: this.getElementTransform(visible, this.animationType) }
    );

    if (restoreListener) {
      this.subscribeToMouseScroll();
    }
  }

  /**
   * Show / hide element instantly (without animation) from page
   */
  private toggleElementInstantly(visible: boolean): void {
    this.toggleTransition(false);
    this.toggleElement(visible);
    this.changeDetectorRef.detectChanges();
    this.toggleTransition(true);
  }

  /**
   * Get animation transform by AnimationTypeEnum
   * @param isElementVisible is element already visible
   * @param animationType animation type
   */
  private getElementTransform(isElementVisible: boolean, animationType: AnimationTypeEnum): string {
    switch (animationType) {
      case AnimationTypeEnum.TOP:
        return isElementVisible ? 'translateY(0)' : `translateY(-${this.animationDistancePx}px)`;
      case AnimationTypeEnum.BOTTOM:
        return isElementVisible ? 'translateY(0)' : `translateY(${this.animationDistancePx}px)`;
      case AnimationTypeEnum.LEFT:
        return isElementVisible ? 'translateX(0)' : `translateX(-${this.animationDistancePx}px)`;
      case AnimationTypeEnum.RIGHT:
        return isElementVisible ? 'translateX(0)' : `translateX(${this.animationDistancePx}px)`;
      case AnimationTypeEnum.ZOOM:
        return isElementVisible ? 'scale(1)' : `scale(${this.scaleRatio})`;
      default:
        return 'none';
    }
  }

  /**
   * Enable / disable element animation
   * @param enabled enabled or disabled transition
   */
  private toggleTransition(enabled: boolean): void {
    if (enabled) {
      this.setElementStyle(
        this.htmlElement.nativeElement,
        { name: 'transition-duration', value: `${this.transitionDurationMs}ms` }
      );
    } else {
      this.removeElementStyle(
        this.htmlElement.nativeElement,
        { name: 'transition-duration' }
      );
    }
  }

  /**
   * On mouse scroll event
   */
  private onMouseScroll(): void {
    if (this.isOnlyFirstTime && this.elementVisible) {
      this.onScrollListener.unsubscribe();
    }

    const isElementInView: boolean = this.isElementInView();

    if (isElementInView && !this.elementVisible) {
      this.toggleElement(true);
    } else if (!isElementInView && !this.elementVisible) {
      this.toggleElement(false);
    }
  }
}
