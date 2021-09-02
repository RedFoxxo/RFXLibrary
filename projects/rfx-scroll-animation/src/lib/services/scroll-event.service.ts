import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollEventService implements OnDestroy {
  /**
   * Subscribe to body scroll changes.
   * @type {BehaviorSubject<number>}
   */
  private subjectScroll: BehaviorSubject<number>;

  /**
   * Mouse scroll listener.
   * @type {EventListenerOrEventListenerObject}
   */
  private mouseScrollEvent: EventListenerOrEventListenerObject;

  /**
   * Current element with scroll event.
   * @type {HTMLElement | Document | undefined}
   */
  private element: HTMLElement | Document | undefined;

  constructor() {
    this.subjectScroll = new BehaviorSubject<number>(0);
    this.mouseScrollEvent = this.onMouseScroll.bind(this);
  }

  public ngOnDestroy(): void {
    this.destroyListener();
  }

  /**
   * Create mouse scroll listener.
   * @param {HTMLElement} element - Element with scroll event.
   */
  public createListener(element: HTMLElement | Document): void {
    this.element = element;
    this.element.addEventListener('scroll', this.mouseScrollEvent, { passive: true });
  }

  /**
   * Destroy mouse scroll listener.
   */
  public destroyListener(): void {
    this.element?.removeEventListener('scroll', this.mouseScrollEvent);
    this.element = undefined;
  }

  /**
   * Trigger mouse scroll event.
   * @param {number} event - Mouse scroll event.
   */
  private onMouseScroll(event: Event): void {
    const target: HTMLElement = event.target instanceof Document ? event.target.documentElement : (event.target as HTMLElement);
    this.subjectScroll.next(target.scrollTop);
  }

  /**
   * Get body scroll event.
   * @return {Observable<number>} - Body scroll event.
   */
  public getMouseScroll(): Observable<number> {
    return this.subjectScroll.asObservable();
  }

  /**
   * Get body scroll current value.
   * @return {number} - Body scroll value.
   */
  public getMouseScrollValue(): number {
    return this.subjectScroll.value;
  }
}
