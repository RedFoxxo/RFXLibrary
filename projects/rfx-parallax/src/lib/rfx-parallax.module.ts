import { NgModule } from '@angular/core';
import { RfxParallaxComponent } from './components/rfx-parallax/rfx-parallax.component';
import { WillChangeDirective } from './directives/will-change.directive';
import { ParallaxUtilsHelper } from './helpers/parallax-utils.helper';

@NgModule({
  declarations: [
    RfxParallaxComponent,
    WillChangeDirective
  ],
  imports: [],
  exports: [
    RfxParallaxComponent
  ],
  providers: [
    ParallaxUtilsHelper
  ]
})
export class RfxParallaxModule { }
