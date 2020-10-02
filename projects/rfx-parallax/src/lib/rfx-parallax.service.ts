import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfxParallaxService implements OnDestroy {
  private mouseScroll: any;
  private windowResize: any;
  private subjectScroll: BehaviorSubject<undefined>;
  private subjectResize: BehaviorSubject<undefined>;

  constructor() {
    this.subjectScroll = new BehaviorSubject<undefined>(undefined);
    this.subjectResize = new BehaviorSubject<undefined>(undefined);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('scroll', this.mouseScroll);
    document.removeEventListener('resize', this.windowResize);
  }

  /**
   * Init listeners
   */
  public initListeners(): void {
    this.mouseScroll = this.onMouseScroll.bind(this);
    this.windowResize = this.onWindowResize.bind(this);
    document.addEventListener('scroll', this.mouseScroll, false);
    window.addEventListener('resize', this.windowResize, false);
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
   * Window resize event
   */
  private onWindowResize(): void {
    this.subjectResize.next(undefined);
  }

  /**
   * Window resize event observable
   */
  public getWindowResize(): Observable<undefined> {
    return this.subjectResize.asObservable();
  }
}
