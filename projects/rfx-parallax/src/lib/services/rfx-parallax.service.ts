import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { RfxParallaxResizeService } from './rfx-parallax-resize.service';
import { RfxParallaxScrollService } from './rfx-parallax-scroll.service';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private rfxParallaxResizeService: RfxParallaxResizeService,
    private rfxParallaxScrollService: RfxParallaxScrollService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Start element scroll event, window resize event and element resize event listeners
   * @param scrollElement main element with scroll property
   */
  public initListeners(scrollElement?: HTMLElement): void {
    this.rfxParallaxResizeService.init(this.renderer, scrollElement);
    this.rfxParallaxScrollService.init(this.renderer, scrollElement);
  }
}
