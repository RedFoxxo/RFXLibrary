import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  private subjectScroll: Subject<undefined>;
  private subjectNavigation: BehaviorSubject<boolean>;

  private renderer: Renderer2;
  private mouseScrollEvent!: () => void;
  private routerNavEvent!: Subscription;

  constructor(
    private rendererFactory: RendererFactory2,
    private router: Router
  ) {
    this.subjectScroll = new Subject<undefined>();
    this.subjectNavigation = new BehaviorSubject<boolean>(false);
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  private destroyListeners(): void {
    if (this.mouseScrollEvent) {
      this.mouseScrollEvent();
    }

    this.routerNavEvent?.unsubscribe();
  }

  public initListeners(scrollElement?: HTMLElement): void {
    this.destroyListeners();
    this.mouseScrollEvent = this.renderer.listen(scrollElement ?? document, 'scroll', () => this.onMouseScroll());
    this.initRouterEventListener();
  }

  private initRouterEventListener(): void {
    this.routerNavEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onRouterEvent(true);
      }
      if (event instanceof NavigationStart) {
        this.onRouterEvent(false);
      }
    });
  }

  private onRouterEvent(pageReady: boolean): void {
    this.subjectNavigation.next(pageReady);
  }

  private onMouseScroll(): void {
    this.subjectScroll.next();
  }

  public getMouseScroll(): Observable<undefined> {
    return this.subjectScroll.asObservable();
  }

  public getRouterEvent(): Observable<boolean> {
    return this.subjectNavigation.asObservable();
  }

  public getRouterEventValue(): boolean {
    return this.subjectNavigation.value;
  }
}
