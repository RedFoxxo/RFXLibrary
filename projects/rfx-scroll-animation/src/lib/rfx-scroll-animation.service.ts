import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RfxScrollAnimationService implements OnDestroy {
  private mouseScroll: any;
  private subjectScroll: BehaviorSubject<undefined>;
  private subjectNavigation: BehaviorSubject<boolean>;

  constructor(
    private router: Router
  ) {
    this.subjectScroll = new BehaviorSubject<undefined>(undefined);
    this.subjectNavigation = new BehaviorSubject<boolean>(false);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('scroll', this.mouseScroll);
  }

  /**
   * Init listeners
   */
  public initListeners(): void {
    this.mouseScroll = this.onMouseScroll.bind(this);
    document.addEventListener('scroll', this.mouseScroll, false);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.subjectNavigation.next(true);
    });
  }

  /**
   * Mouse scroll event
   */
  private onMouseScroll(): void {
    this.subjectScroll.next(undefined);
  }

  /**
   * Mouse scroll event observable
   */
  public getMouseScroll(): Observable<undefined> {
    return this.subjectScroll.asObservable();
  }

  /**
   * NavigationEnd event
   */
  public getNavigationEndValue(): boolean {
    return this.subjectNavigation.value;
  }

  /**
   * NavigationEnd event observable
   */
  public getNavigationEnd(): Observable<boolean> {
    return this.subjectNavigation.asObservable();
  }
}
