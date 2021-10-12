import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ScrollEventService } from './scroll-event.service';
import { ResizeEventService } from './resize-event.service';
import { HeightEventService } from './height-event.service';
import { ElementsManagementService } from './elements-management.service';
import { AnimatedElementModel } from '../models';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  private isBrowser: boolean;

  constructor(
    private scrollEventService: ScrollEventService,
    private resizeEventService: ResizeEventService,
    private heightEventService: HeightEventService,
    private elementsManagementService: ElementsManagementService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

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
   * @param {HTMLElement | Document | undefined} element - Scroll element to use.
   */
  public initListeners(element: HTMLElement | Document | undefined): void {
    this.destroyListeners();

    if (this.isBrowser) {
      this.scrollEventService.createListener(element ?? document);
      this.resizeEventService.createListener();
      this.heightEventService.createListener(element ?? document);
    }
  }

  /**
   * Reset all elements positions.
   * Useful when you want to reset all elements to their original position.
   */
  public reset(): void {
    const registeredElements: AnimatedElementModel[] = this.elementsManagementService.getElements();

    for (const registeredElement of registeredElements) {
      registeredElement.element.reset();
    }
  }
}
