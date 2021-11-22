import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RfxParallaxComponent } from '../components';
import { RegistryElementModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  /**
   * Available solid elements in page
   * with isReady state.
   * @type {RegistryElementModel[]}
   */
  private solidElements: RegistryElementModel[];

  /**
   * Subscribe to solid elements ready event.
   * @type {BehaviorSubject<boolean>}
   */
  private subjectSolidElementsReady: BehaviorSubject<boolean>;

  constructor() {
    this.solidElements = [];
    this.subjectSolidElementsReady = new BehaviorSubject<boolean>(false);
  }

  /**
   * Register solid element inside service.
   * @param {RfxScrollAnimationComponent} element - solid element.
   * @return {number} - index of element.
   */
  public registerSolidElement(element: RfxParallaxComponent): number {
    return this.solidElements.push({ isReady: false, element }) - 1;
  }

  /**
   * Set solid element ready in service list.
   * @param {number} index - index of element.
   */
  public setSolidElementReady(index: number): void {
    this.solidElements[index].isReady = true;
    this.checkSolidElementsReady();
  }

  /**
   * Check if all solid elements are ready.
   * If yes, trigger solid elements ready event.
   */
  private checkSolidElementsReady(): void {
    const ready: boolean = this.solidElements.every(
      (element) => element.isReady
    );

    if (ready) {
      this.onSolidElementsReady(ready);
    }
  }

  /**
   * Trigger solid elements ready event.
   * @param {boolean} isReady - solid elements ready state.
   */
  public onSolidElementsReady(isReady: boolean): void {
    this.subjectSolidElementsReady.next(isReady);
  }
}
