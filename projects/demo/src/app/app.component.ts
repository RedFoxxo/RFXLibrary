import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { RfxImageLoaderService } from 'rfx-image-loader';
import { RfxParallaxService } from 'rfx-parallax';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('scrollbar')
  public scrollbarElement!: NgScrollbar;

  constructor(
    private rfxParallaxService: RfxParallaxService
  ) {}

  public ngAfterViewInit(): void {
    this.rfxParallaxService.initListeners(this.scrollbarElement.viewport.nativeElement);
  }
}
