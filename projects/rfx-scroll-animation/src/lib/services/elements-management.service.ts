import { Injectable } from '@angular/core';
import { AnimatedElementModel } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { RfxScrollAnimationComponent } from '../components';

@Injectable({
  providedIn: 'root'
})
export class ElementsManagementService {
  /**
   * Subscribe to elements ready event.
   * @type {BehaviorSubject<boolean>}
   */
  private subjectElementsReady: BehaviorSubject<boolean>;

  /**
   * Available animated elements in page
   * with isReady state.
   * @type {AnimatedElementModel[]}
   */
  private elements: AnimatedElementModel[];

  constructor() {
    this.elements = [];
    this.subjectElementsReady = new BehaviorSubject<boolean>(false);
  }

  /**
   * Trigger elements ready event.
   * @param {boolean} isReady - Elements ready state.
   */
  public onElementsReady(isReady: boolean): void {
    this.subjectElementsReady.next(isReady);
  }

  /**
   * Get elements ready event.
   * @return {Observable<boolean>} - Elements ready event.
   */
  public getElementsReady(): Observable<boolean> {
    return this.subjectElementsReady.asObservable();
  }

  /**
   * Register animated element inside service.
   * @param {RfxScrollAnimationComponent} element - Animated element.
   * @return {number} - Index of element.
   */
  public registerElement(element: RfxScrollAnimationComponent): number {
    this.elements.push({ isReady: false, element });
    return this.elements.length - 1;
  }

  /**
   * Set element ready in service list.
   * @param {number} index - Index of element.
   */
  public setElementReady(index: number): void {
    this.elements[index].isReady = true;
    this.checkElementsReady();
  }

  /**
   * Check if all elements are ready.
   * If yes, trigger elements ready event.
   */
  private checkElementsReady(): void {
    const ready: boolean = this.elements.every(element => element.isReady);

    if (ready) {
      this.onElementsReady(ready);
    }
  }
}
