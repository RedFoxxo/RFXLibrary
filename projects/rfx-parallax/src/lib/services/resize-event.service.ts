import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeEventService implements OnDestroy {
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

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subjectResize = new Subject<undefined>();
    this.resizeEvent = this.onResizeEvent.bind(this);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngOnDestroy(): void {
    this.destroyListener();
  }

  /**
   * Create window resize listener.
   */
  public createListener(): void {
    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeEvent, { passive: true });
    }
  }

  /**
   * Destroy window resize listener.
   */
  public destroyListener(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeEvent);
    }
  }

  /**
   * Trigger window resize event.
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
