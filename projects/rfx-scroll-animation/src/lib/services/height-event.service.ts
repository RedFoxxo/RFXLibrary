import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeightEventService {
  /**
   * Subscribe to body height changes.
   * @type {BehaviorSubject<number>}
   */
  private subjectHeight: BehaviorSubject<number>;

  /**
   * Body height changes listener.
   * @type {ResizeObserver | undefined}
   */
  private heightEvent: ResizeObserver | undefined;

  /**
   * Current element with height value.
   * @type {HTMLElement | undefined}
   */
  private element: HTMLElement | undefined;

  constructor() {
    this.subjectHeight = new BehaviorSubject<number>(0);
  }

  /**
   * Create page height event listener
   * and destroy previous one if exists.
   * @param {HTMLElement} element - Page element
   */
  public createListener(element: HTMLElement): void {
    this.destroyListener();
    this.element = element;

    const heightEventListener = new ResizeObserver(() => {
      this.onHeightEvent(this.element?.scrollHeight ?? 0);
    });

    heightEventListener.observe(this.element);

    for (var i = 0; i < this.element.children.length; i++) {
      heightEventListener.observe(this.element.children[i]);
    }

    this.heightEvent = heightEventListener;
  }

  /**
   * Destroy page height event listener
   * and clear all previous values.
   */
  public destroyListener(): void {
    this.heightEvent?.disconnect();
    this.heightEvent = undefined;
    this.element = undefined;
  }

  /**
   * Trigger body height event.
   * @param {number} height - Body height.
   */
  private onHeightEvent(height: number): void {
    this.subjectHeight.next(height);
  }

  /**
   * Get body height event.
   * @return {Observable<number>} - Body height event.
   */
  public getHeight(): Observable<number> {
    return this.subjectHeight.asObservable();
  }

  /**
   * Get body height current value.
   * @return {number} - Body height.
   */
  public getHeightValue(): number {
    return this.element?.scrollHeight ?? 0;
  }
}
