import { Injectable, OnDestroy } from '@angular/core';
import { ScrollEventService } from './scroll-event.service';
import { ResizeEventService } from './resize-event.service';
import { HeightEventService } from './height-event.service';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  constructor(
    private scrollEventService: ScrollEventService,
    private resizeEventService: ResizeEventService,
    private heightEventService: HeightEventService
  ) { }

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  /**
   * Destroy all listeners.
   */
  private destroyListeners(): void {
    this.resizeEventService.destroyListener();
    this.scrollEventService.destroyListener();
    this.heightEventService.destroyListener();
  }

  /**
   * Destroy all extisting listeners and then create new listeners.
   * Initialize mouse scroll, body height and height change listeners.
   * Default body element is the document element.
   * @param {HTMLElement} bodyElement - Body element to use.
   */
  public initListeners(bodyElement: HTMLElement = document.body): void {
    this.destroyListeners();
    this.scrollEventService.createListener(bodyElement);
    this.resizeEventService.createListener();
    this.heightEventService.createListener(bodyElement);
  }
}
