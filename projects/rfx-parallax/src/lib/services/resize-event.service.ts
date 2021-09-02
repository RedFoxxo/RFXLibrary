import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeEventService implements OnDestroy {
  /**
   * Subscribe to window resize changes.
   * @type {BehaviorSubject<number>}
   */
  private subjectResize: BehaviorSubject<number>;

  /**
   * Window resize listener.
   * @type {EventListenerOrEventListenerObject}
   */
  private resizeEvent: EventListenerOrEventListenerObject;

  constructor() {
    this.subjectResize = new BehaviorSubject<number>(0);
    this.resizeEvent = this.onResizeEvent.bind(this);
  }

  public ngOnDestroy(): void {
    this.destroyListener();
  }

  /**
   * Create window resize listener.
   */
  public createListener(): void {
    window.addEventListener('resize', this.resizeEvent, { passive: true });
  }

  /**
   * Destroy window resize listener.
   */
  public destroyListener(): void {
    window.removeEventListener('resize', this.resizeEvent);
  }

  /**
   * Trigger window resize event.
   * @param {Event} event - Window resize event.
   */
  private onResizeEvent(event: Event): void {
    this.subjectResize.next((event.target as any).innerWidth);
  }

  /**
   * Get window resize event.
   * @return {Observable<number>} - Window resize event.
   */
  public getResize(): Observable<number> {
    return this.subjectResize.asObservable();
  }
}
