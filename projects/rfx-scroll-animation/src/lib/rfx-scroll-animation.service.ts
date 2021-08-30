import { Injectable, OnDestroy } from '@angular/core';
import { RfxScrollAnimationComponent } from './rfx-scroll-animation/rfx-scroll-animation.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnimatedElementModel } from 'rfx-scroll-animation';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  /**
   * Subscribe to body scroll changes.
   * @type {Observable<number>}
   */
  private subjectScroll: BehaviorSubject<number>;

  /**
   * Subscribe to body height changes.
   * @type {BehaviorSubject<number>}
   */
  private subjectHeight: BehaviorSubject<number>;

  /**
   * Subscribe to page ready event.
   * @type {BehaviorSubject<boolean>}
   */
  private subjectPageReady: BehaviorSubject<boolean>;

  /**
   * Current body element in use.
   * @type {HTMLElement}
   */
  private bodyElement: HTMLElement | undefined;

  /**
   * Mouse scroll listener.
   * @type {EventListener}
   */
  private mouseScrollEvent: EventListenerOrEventListenerObject;

  /**
   * Body height changes listener.
   * @param {number} height
   */
  private bodyHeightEvent: ResizeObserver | undefined;

  /**
   * Available animated elements in page
   * with isReady state.
   * @type {AnimatedElementModel[]}
   */
  private elements: AnimatedElementModel[];

  constructor() {
    this.elements = [];
    this.subjectScroll = new BehaviorSubject<number>(0);
    this.subjectHeight = new BehaviorSubject<number>(0);
    this.subjectPageReady = new BehaviorSubject<boolean>(false);
    this.mouseScrollEvent = this.onMouseScrollEvent.bind(this);
  }

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  /**
   * Destroy all listeners.
   * @return {void}
   */
  private destroyListeners(): void {
    window.removeEventListener('scroll', this.mouseScrollEvent, false);
    this.bodyHeightEvent?.disconnect();
  }

  /**
   * Destroy all extisting listeners, update body element and then create new listeners.
   * Initialize mouse scroll, body height and router navigation listeners.
   * Default body element is the document body element.
   * @param {HTMLElement} bodyElement - Body element to use.
   * @return {void}
   */
  public initListeners(bodyElement: HTMLElement = document.body): void {
    this.destroyListeners();
    this.bodyElement = bodyElement;
    this.bodyElement.addEventListener('scroll', this.mouseScrollEvent, false);
    this.bodyHeightEvent = this.getBodyHeightEventListener(this.bodyElement);
  }

  /**
   * Initialize and return body element height changes listener.
   * @param {HTMLElement} bodyElement - Body element to use.
   * @return {ResizeObserver} - Resize observer.
   */
  private getBodyHeightEventListener(bodyElement: HTMLElement): ResizeObserver {
    this.onHeightChangeEvent(bodyElement.scrollHeight);

    const bodyHeightEventListener = new ResizeObserver(() => {
      this.onHeightChangeEvent(bodyElement.scrollHeight);
    });

    bodyHeightEventListener.observe(bodyElement);

    for (var i = 0; i < bodyElement.children.length; i++) {
      bodyHeightEventListener.observe(bodyElement.children[i]);
    }

    return bodyHeightEventListener;
  }

  /**
   * Trigger mouse scroll event.
   * @param {number} event - Mouse scroll event.
   * @return {void}
   */
  private onMouseScrollEvent(event: Event): void {
    this.subjectScroll.next((event.target as HTMLElement).scrollTop);
  }

  /**
   * Trigger body height event.
   * @param {number} height - Body height.
   * @return {void}
   */
  private onHeightChangeEvent(height: number): void {
    this.subjectHeight.next(height);
  }

  /**
   * Trigger page ready event.
   * @param {boolean} isReady - Page ready state.
   * @return {void}
   */
  public onPageReady(isReady: boolean): void {
    this.subjectPageReady.next(isReady);
  }

  /**
   * Get body height current value;
   * @return {number} - Body height.
   */
  public getBodyHeightValue(): number {
    return this.bodyElement?.scrollHeight ?? 0;
  }

  /**
   * Get body scroll current value.
   * @return {number} - Body scroll value.
   */
  public getMouseScrollValue(): number {
    return this.subjectScroll.value;
  }

  /**
   * Get body height event.
   * @return {Observable<number>} - Body height event.
   */
  public getBodyHeight(): Observable<number> {
    return this.subjectHeight.asObservable();
  }

  /**
   * Get body scroll event.
   * @return {Observable<number>} - Body scroll event.
   */
  public getMouseScroll(): Observable<number> {
    return this.subjectScroll.asObservable();
  }

  /**
   * Get page ready event.
   * @return {Observable<boolean>} - Page ready event.
   */
  public getPageReady(): Observable<boolean> {
    return this.subjectPageReady.asObservable();
  }

  /**
   * Register animated element inside service.
   * @param {RfxScrollAnimationComponent} element - Animated element.
   * @return {number} - Index of element.
   */
  public registerElement(element: RfxScrollAnimationComponent): number {
    this.elements.push({ isReady: false, element });
    return this.elements.length - 1;
  }

  /**
   * Set element ready in service list.
   * @param {number} index - Index of element.
   */
  public setElementReady(index: number): void {
    this.elements[index].isReady = true;
    this.checkElementsReady();
  }

  /**
   * Check if all elements are ready.
   * If yes, trigger page ready event.
   * @return {void}
   */
  private checkElementsReady(): void {
    const ready: boolean = this.elements.every(element => element.isReady);

    if (ready) {
      this.onPageReady(ready);
    }
  }
}
