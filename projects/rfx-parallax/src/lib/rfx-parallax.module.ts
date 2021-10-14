import { NgModule } from '@angular/core';
import { RfxParallaxImageComponent } from './components/rfx-parallax-image/rfx-parallax-image.component';
import { WillChangeDirective } from './directives/will-change.directive';
import { ParallaxUtilsHelper } from './helpers/parallax-utils.helper';

@NgModule({
  declarations: [
    RfxParallaxImageComponent,
    WillChangeDirective
  ],
  imports: [],
  exports: [
    RfxParallaxImageComponent
  ],
  providers: [
    ParallaxUtilsHelper
  ]
})
export class RfxParallaxModule { }
