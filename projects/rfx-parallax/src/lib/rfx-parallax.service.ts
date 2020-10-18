import { ElementRef, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService implements OnDestroy {
  private renderer: Renderer2;

  private subjectScroll: BehaviorSubject<undefined>;
  private subjectResize: BehaviorSubject<undefined>;

  private scrollEvent: () => void;
  private resizeEvent: () => void;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.subjectScroll = new BehaviorSubject<undefined>(undefined);
    this.subjectResize = new BehaviorSubject<undefined>(undefined);
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
  public initListeners(element?: ElementRef): void {
    const scrollElement = element ?? document;
    this.scrollEvent = this.renderer.listen(scrollElement, 'scroll', () => this.onMouseScroll());
    this.resizeEvent = this.renderer.listen(window, 'resize', () => this.onWindowResize());
  }

  /**
   * Mouse scroll event
   */
  private onMouseScroll(): void {
    this.subjectScroll.next(undefined);
  }

  /**
   * Mouse scroll event observable
   */
  public getMouseScroll(): Observable<undefined> {
    return this.subjectScroll.asObservable();
  }

  /**
   * Window resize event
   */
  private onWindowResize(): void {
    this.subjectResize.next(undefined);
  }

  /**
   * Window resize event observable
   */
  public getWindowResize(): Observable<undefined> {
    return this.subjectResize.asObservable();
  }
}
