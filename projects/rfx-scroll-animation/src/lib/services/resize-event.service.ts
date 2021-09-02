import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeEventService {
  /**
   * Subscribe to window resize changes.
   * @type {Subject<undefined>}
   */
  private subjectResize: Subject<undefined>;

  /**
   * Window resize listener.
   * @type {EventListenerOrEventListenerObject}
   */
  private resizeEvent: EventListenerOrEventListenerObject;

  constructor() {
    this.subjectResize = new Subject<undefined>();
    this.resizeEvent = this.onResizeEvent.bind(this);
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
   * @return {void}
   */
  private onResizeEvent(): void {
    this.subjectResize.next(undefined);
  }

  /**
   * Get window resize event.
   * @return {Observable<undefined>} - Window resize event.
   */
  public getResize(): Observable<undefined> {
    return this.subjectResize.asObservable();
  }
}
