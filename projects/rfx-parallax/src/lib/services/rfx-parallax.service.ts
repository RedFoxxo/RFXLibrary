import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ResizeEventService } from './resize-event.service';
import { ScrollEventService } from './scroll-event.service';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private resizeEventService: ResizeEventService,
    private scrollEventService: ScrollEventService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Start element scroll event, window resize event and element resize event listeners
   * @param element main element with scroll property
   */
  public initListeners(element: HTMLElement | Document = document): void {
    this.resizeEventService.createListener();
    this.scrollEventService.createListener(element);
  }
}
