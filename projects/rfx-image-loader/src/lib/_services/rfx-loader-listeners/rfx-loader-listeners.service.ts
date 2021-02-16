import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxLoaderListenersService {
  private renderer: Renderer2;
  private subjectResize: Subject<number>;
  private windowResizeEvent!: () => void;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.subjectResize = new Subject<number>();
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initListeners();
  }

  public ngOnDestroy(): void {
    this.windowResizeEvent();
  }

  private initListeners(): void {
    this.windowResizeEvent = this.renderer.listen(window, 'resize', (event) => this.onWindowResize(event));
  }

  private onWindowResize(event: Event | any): void {
    this.subjectResize.next(event.target.innerWidth);
  }

  public getWindowResize(): Observable<number | undefined> {
    return this.subjectResize.asObservable();
  }
}
