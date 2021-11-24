import { Injectable } from '@angular/core';
import { RfxParallaxComponent, RfxParallaxImageComponent } from 'rfx-parallax';
import { RegistryElementModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IntersectionService {
  private observer: IntersectionObserver | undefined;
  private rootMargin: string;

  private components: (RfxParallaxComponent | RfxParallaxImageComponent)[];
  private componentsElement: Element[];

  constructor() {
    this.rootMargin = '500px';
    this.components = [];
    this.componentsElement = [];
  }

  public createListener(scrollElement: HTMLElement | Document): void {
    const options: IntersectionObserverInit = {
      root: scrollElement,
      rootMargin: this.rootMargin
    }

    this.observer = new IntersectionObserver((entries, observer) => {
      const entriesLength = entries.length;

      for (let i = 0; i < entriesLength; i++) {
        const entry: IntersectionObserverEntry = entries[i];
        const indexOfElement: number = this.componentsElement.indexOf(entry.target);

        if (indexOfElement > -1) {
          this.components[indexOfElement].onIntersection(entry);
        }
      }
    }, options);
  }

  public addElements(...elements: RegistryElementModel[]): void {
    if (this.observer) {
      for (let i = 0; i < elements.length; i++) {
        this.components.push(elements[i].element);
        this.componentsElement.push(elements[i].element.htmlElement.nativeElement);
        this.observer.observe(elements[i].element.htmlElement.nativeElement);
      }
    }
  }
}
