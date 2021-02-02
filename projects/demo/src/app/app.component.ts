import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { RfxParallaxService } from 'rfx-parallax';
import { RfxScrollAnimationService } from 'rfx-scroll-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('scrollbar')
  public scrollbarElement!: NgScrollbar;

  constructor(
    private rfxParallaxService: RfxParallaxService,
    private rfxScrollAnimationService: RfxScrollAnimationService
  ) {}

  public ngAfterViewInit(): void {
    this.rfxParallaxService.initListeners(this.scrollbarElement.viewport.nativeElement);
    this.rfxScrollAnimationService.initListeners(this.scrollbarElement.viewport.nativeElement);
  }
}
