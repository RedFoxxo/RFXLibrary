import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ScrollEventService } from '../services';
import { SectionAreaModel } from '../models';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[libWillChange]'
})
export class WillChangeDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Area where element has will-change property.
   * Default is window height * 2.
   * @type {number}
   */
  @Input()
  public triggerArea: number;

  /**
   * If disabled, element will have will-change
   * property set to 'auto'.
   * @type {boolean}
   */
  @Input()
  public isDisabled: boolean;

  /**
   * Range in pixels where the element has
   * will-change property.
   * @type {SectionAreaModel | undefined}
   */
  private willChangeArea: SectionAreaModel | undefined;

  /**
   * Element will change value.
   * @type {boolean}
   */
  private willChange: boolean;

  /**
   * Subscription to scroll event.
   * @type {Subscription | undefined}
   */
  private scrollEventListener: Subscription | undefined;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private scrollEventService: ScrollEventService
  ) {
    this.triggerArea = window.innerHeight / 4 * 6;
    this.isDisabled = false;
    this.willChange = true;
  }

  public ngOnInit(): void {
    this.willChangeArea = this.getWillChangeArea();

    if (!this.isDisabled) {
      this.createListener();
    }
  }

  public ngOnDestroy(): void {
    this.destroyListener();
  }

  /**
   * Create listener for scroll event.
   */
  private createListener(): void {
    this.scrollEventListener = this.scrollEventService.getMouseScroll().subscribe(
      (scroll: number) => this.checkWillChange(scroll)
    );
  }

  /**
   * Destroy scroll event listener.
   */
  private destroyListener(): void {
    this.scrollEventListener?.unsubscribe();
  }

  /**
   * Refresh will-change area if some properties changed.
   * @param {SimpleChanges} changes - Changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes?.triggerArea?.currentValue !== undefined && !changes?.triggerArea?.firstChange) ||
       ((changes?.isDisabled?.currentValue !== undefined && !changes?.isDisabled?.firstChange))) {
      const scroll: number = this.scrollEventService.getMouseScrollValue();
      this.willChangeArea = this.getWillChangeArea();
      this.checkWillChange(scroll);
    }
  }

  /**
   * Check will-change property and
   * update if needed.
   * @param {number} scroll - Scroll position.
   */
  private checkWillChange(scroll: number): void {
    if (this.willChangeArea) {
      const isElementInArea: boolean = this.isElementInArea(scroll, this.willChangeArea);

      if (isElementInArea !== this.willChange) {
        this.setWillChange(isElementInArea);
      }
    }
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

  /**
   * Calculate area where element is probably going to be animated soon.
   * @returns {number} - Will-change area.
   */
  private getWillChangeArea(): SectionAreaModel {
    const elementRect: DOMRect = this.htmlElement.nativeElement.getBoundingClientRect();
    const scroll: number = this.scrollEventService.getMouseScrollValue();
    const elementTop: number = elementRect.top + scroll;
    const areaTop: number = elementTop - this.triggerArea;
    const areaBottom: number = elementTop + this.triggerArea;
    return { top: areaTop, bottom: areaBottom };
  }

  /**
   * Set element will-change property.
   * @param {boolean} willChange - will-change enabled or disabled.
   */
  private setWillChange(willChange: boolean): void {
    this.willChange = willChange;
    this.renderer.setStyle(
      this.htmlElement.nativeElement,
      'will-change',
      willChange ? 'transform' : 'auto'
    );
  }
}
