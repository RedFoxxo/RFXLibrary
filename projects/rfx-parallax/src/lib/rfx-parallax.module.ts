import { NgModule } from '@angular/core';
import { RfxParallaxDirective } from './rfx-parallax.directive';
import { RfxParallaxComponent } from './components/rfx-parallax/rfx-parallax.component';

@NgModule({
  declarations: [
    RfxParallaxDirective, // DEPRECATED
    RfxParallaxComponent
  ],
  imports: [],
  exports: [
    RfxParallaxDirective, // DEPRECATED
    RfxParallaxComponent
  ]
})
export class RfxParallaxModule { }
