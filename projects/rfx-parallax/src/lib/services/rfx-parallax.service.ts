import { Injectable } from '@angular/core';
import { ResizeEventService } from './resize-event.service';
import { ScrollEventService } from './scroll-event.service';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService {
  constructor(
    private resizeEventService: ResizeEventService,
    private scrollEventService: ScrollEventService
  ) { }

  /**
   * Start element scroll event, window resize event and element resize event listeners
   * @param element main element with scroll property
   */
  public initListeners(element: HTMLElement | Document = document): void {
    this.resizeEventService.createListener();
    this.scrollEventService.createListener(element);
  }
}
