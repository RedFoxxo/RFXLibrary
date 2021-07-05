import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResizeObserverEntryModel, ResizeObserverOptionsModel } from '../models';

declare class ResizeObserver {
  constructor(callback: (entries: ReadonlyArray<ResizeObserverEntryModel>, observer: ResizeObserver) => void);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptionsModel): void;
  unobserve(target: Element): void;
}

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxResizeService implements OnDestroy {
  private subjectResize: BehaviorSubject<number | undefined>;

  private elementHeightEvent!: ResizeObserver;
  private windowResizeEvent!: () => void;

  constructor() {
    this.subjectResize = new BehaviorSubject<number | undefined>(undefined);
  }

  public ngOnDestroy(): void {
    if (this.windowResizeEvent) {
      this.windowResizeEvent();
    }

    this.elementHeightEvent?.disconnect();
  }

  /**
   * Start window resize event and element resize event listeners
   * @param renderer renderer created from renderer factory
   * @param scrollElement main element with scroll property
   */
  public init(renderer: Renderer2, scrollElement?: HTMLElement): void {
    this.windowResizeEvent = renderer.listen(window, 'resize', (event) => this.onWindowResize(event));

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
