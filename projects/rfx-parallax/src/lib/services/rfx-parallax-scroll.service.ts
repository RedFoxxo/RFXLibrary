import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxScrollService implements OnDestroy {
  private subjectScroll: BehaviorSubject<number | undefined>;
  private elementScrollEvent!: () => void;

  constructor() {
    this.subjectScroll = new BehaviorSubject<number | undefined>(undefined);
  }

  public ngOnDestroy(): void {
    if (this.elementScrollEvent) {
      this.elementScrollEvent();
    }
  }

  /**
   * Start element scroll event listener
   * @param renderer renderer created from renderer factory
   * @param scrollElement main element with scroll property
   */
  public init(renderer: Renderer2, scrollElement?: HTMLElement): void {
    this.elementScrollEvent = renderer.listen(scrollElement ?? window, 'scroll', (event) => this.onMouseScroll(event));
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
}
