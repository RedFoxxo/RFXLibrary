import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ResizeEventService } from './resize-event.service';
import { ScrollEventService } from './scroll-event.service';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService {
  private isBrowser: boolean;

  constructor(
    private resizeEventService: ResizeEventService,
    private scrollEventService: ScrollEventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Start element scroll event, window resize event and element resize event listeners
   * @param element main element with scroll property
   */
  public initListeners(element?: HTMLElement | Document): void {
    if (this.isBrowser) {
      this.resizeEventService.createListener();
      this.scrollEventService.createListener(element ?? document);
    }
  }
}
