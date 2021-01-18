import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResizeObserverEntry, IResizeObserverOptions } from './_interfaces';

declare class ResizeObserver {
  constructor(callback: (entries: ReadonlyArray<IResizeObserverEntry>, observer: ResizeObserver) => void);
  disconnect(): void;
  observe(target: Element, options?: IResizeObserverOptions): void;
  unobserve(target: Element): void;
}

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService implements OnDestroy {
  private renderer: Renderer2;

  private subjectScroll: BehaviorSubject<number | undefined>;
  private subjectResize: BehaviorSubject<number | undefined>;

  private elementHeightEvent!: ResizeObserver;
  private elementScrollEvent!: () => void;
  private windowResizeEvent!: () => void;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.subjectScroll = new BehaviorSubject<number | undefined>(undefined);
    this.subjectResize = new BehaviorSubject<number | undefined>(undefined);
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnDestroy(): void {
    if (this.elementScrollEvent) {
      this.elementScrollEvent();
    }

    if (this.windowResizeEvent) {
      this.windowResizeEvent();
    }

    this.elementHeightEvent?.disconnect();
  }

  /**
   * Start element scroll event, window resize event and element resize event listeners
   * @param scrollElement main element with scroll property
   */
  public initListeners(scrollElement?: HTMLElement): void {
    this.elementScrollEvent = this.renderer.listen(scrollElement ?? window, 'scroll', (event) => this.onMouseScroll(event));
    this.windowResizeEvent = this.renderer.listen(window, 'resize', (event) => this.onWindowResize(event));

    if (scrollElement) {
      this.setElementResizeEvent(scrollElement);
    }
  }

  /**
   * Observe scrollElement 'scrollHeight' property change
   * @param scrollElement main element with scroll property
   */
  private setElementResizeEvent(scrollElement: HTMLElement): void {
    this.elementHeightEvent = new ResizeObserver(() => this.onWindowResize(
      { target: { innerWidth: scrollElement.clientWidth }}
    ));
    const elementChildrenList: Element[] = Array.from(scrollElement.children);
    for (const children of elementChildrenList) {
      this.elementHeightEvent.observe(children);
    }
  }

  /**
   * Mouse scroll event
   */
  private onMouseScroll(event: Event | any): void {
    this.subjectScroll.next(event.target.scrollTop ?? event.target.documentElement.scrollTop);
  }

  /**
   * Mouse scroll event observable
   */
  public getMouseScroll(): Observable<number | undefined> {
    return this.subjectScroll.asObservable();
  }

  /**
   * Window resize event
   */
  private onWindowResize(event: Event | any): void {
    this.subjectResize.next(event.target.innerWidth);
  }

  /**
   * Window resize event observable
   */
  public getWindowResize(): Observable<number | undefined> {
    return this.subjectResize.asObservable();
  }
}
