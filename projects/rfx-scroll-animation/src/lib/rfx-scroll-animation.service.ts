import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
   * Subscribe to router navigation changes.
   * @type {Observable<boolean>}
   */
  private subjectNavigation: BehaviorSubject<boolean>;

  /**
   * Subscribe to body height changes.
   * @type {BehaviorSubject<number>}
   */
  private subjectHeight: BehaviorSubject<number>;

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
   * Router navigation event listener.
   * @type {Subscription}
   */
  private routerNavEvent: Subscription | undefined;

  constructor(
    private router: Router
  ) {
    this.subjectScroll = new BehaviorSubject<number>(0);
    this.subjectHeight = new BehaviorSubject<number>(0);
    this.subjectNavigation = new BehaviorSubject<boolean>(false);
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
    this.routerNavEvent?.unsubscribe();
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
    this.routerNavEvent = this.getRouterEventListener();
  }

  /**
   * Initialize and return body element height changes listener.
   * @param {HTMLElement} bodyElement - Body element to use.
   * @return {ResizeObserver}
   */
  private getBodyHeightEventListener(bodyElement: HTMLElement): ResizeObserver {
    const bodyHeightEventListener = new ResizeObserver((entries: ResizeObserverEntry[]) => {;
      const height = entries[0].contentRect.height;
      this.onHeightChangeEvent(height);
    });
    bodyHeightEventListener.observe(bodyElement);
    return bodyHeightEventListener;
  }

  /**
   * Initialize and return router navigation event listener.
   * @return {Subscription}
   */
  private getRouterEventListener(): Subscription {
    return this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onRouterEvent(true);
      }
      if (event instanceof NavigationStart) {
        this.onRouterEvent(false);
      }
    });
  }

  /**
   * Trigger router navigation event.
   * @param {boolean} ready - Is page ready to scroll.
   * @return {void}
   */
  private onRouterEvent(ready: boolean): void {
    this.subjectNavigation.next(ready);
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
   */
  private onHeightChangeEvent(height: number): void {
    this.subjectHeight.next(height);
  }

  /**
   * Get body height event.
   * @return {Observable<number>}
   */
  public getBodyHeight(): Observable<number> {
    return this.subjectHeight.asObservable();
  }

  /**
   * Get body scroll event.
   * @return {Observable<number>}
   */
  public getMouseScroll(): Observable<number> {
    return this.subjectScroll.asObservable();
  }

  /**
   * Get router navigation event.
   * @return {Observable<number>}
   */
  public getRouterEvent(): Observable<boolean> {
    return this.subjectNavigation.asObservable();
  }

  /**
   * Get router navigation event value.
   * @return {Observable<number>}
   */
  public getRouterEventValue(): boolean {
    return this.subjectNavigation.value;
  }
}
