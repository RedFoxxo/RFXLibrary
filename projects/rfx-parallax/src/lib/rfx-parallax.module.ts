import { NgModule } from '@angular/core';
import { RfxParallaxImageComponent } from './components/rfx-parallax-image/rfx-parallax-image.component';
import { RfxParallaxComponent } from './components/rfx-parallax/rfx-parallax.component';
import { WillChangeDirective } from './directives/will-change.directive';
import { ParallaxUtilsHelper } from './helpers/parallax-utils.helper';

@NgModule({
  declarations: [
    RfxParallaxComponent,
    RfxParallaxImageComponent,
    WillChangeDirective
  ],
  imports: [],
  exports: [
    RfxParallaxComponent,
    RfxParallaxImageComponent
  ],
  providers: [
    ParallaxUtilsHelper
  ]
})
export class RfxParallaxModule { }
