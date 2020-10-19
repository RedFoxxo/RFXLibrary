import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService implements OnDestroy {
  private renderer: Renderer2;

  private subjectScroll: BehaviorSubject<number>;
  private subjectResize: BehaviorSubject<number>;

  private scrollEvent: () => void;
  private resizeEvent: () => void;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.subjectScroll = new BehaviorSubject<number>(undefined);
    this.subjectResize = new BehaviorSubject<number>(undefined);
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnDestroy(): void {
    if (this.scrollEvent) {
      this.scrollEvent();
    }

    if (this.resizeEvent) {
      this.resizeEvent();
    }
  }

  /**
   * Init listeners
   */
  public initListeners(element?: HTMLElement): void {
    const scrollElement = element ?? document;
    this.scrollEvent = this.renderer.listen(scrollElement, 'scroll', (event) => this.onMouseScroll(event));
    this.resizeEvent = this.renderer.listen(window, 'resize', (event) => this.onWindowResize(event));
  }

  /**
   * Mouse scroll event
   */
  private onMouseScroll(event: Event | any): void {
    this.subjectScroll.next(event.target.scrollTop);
  }

  /**
   * Mouse scroll event observable
   */
  public getMouseScroll(): Observable<number> {
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
  public getWindowResize(): Observable<number> {
    return this.subjectResize.asObservable();
  }
}
