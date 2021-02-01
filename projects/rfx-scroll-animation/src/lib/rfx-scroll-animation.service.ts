import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  private subjectScroll: Subject<undefined>;

  private renderer: Renderer2;
  private mouseScrollEvent!: () => void;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.subjectScroll = new Subject<undefined>();
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  private destroyListeners(): void {
    if (this.mouseScrollEvent) {
      this.mouseScrollEvent();
    }
  }

  public initListeners(scrollElement?: HTMLElement): void {
    this.destroyListeners();
    this.mouseScrollEvent = this.renderer.listen(scrollElement ?? document, 'scroll', () => this.onMouseScroll());
  }

  private onMouseScroll(): void {
    this.subjectScroll.next();
  }

  public getMouseScroll(): Observable<undefined> {
    return this.subjectScroll.asObservable();
  }
}
