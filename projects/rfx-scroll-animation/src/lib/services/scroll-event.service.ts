import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollEventService {
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
   * @type {HTMLElement | undefined}
   */
  private element: HTMLElement | undefined;

  constructor() {
    this.subjectScroll = new BehaviorSubject<number>(0);
    this.mouseScrollEvent = this.onMouseScroll.bind(this);
  }

  /**
   * Create mouse scroll listener.
   * @param {HTMLElement} element - Element with scroll event.
   */
  public createListener(element: HTMLElement): void {
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
    this.subjectScroll.next((event.target as HTMLElement).scrollTop);
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
