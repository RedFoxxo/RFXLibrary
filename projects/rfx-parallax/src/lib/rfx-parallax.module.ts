import { NgModule } from '@angular/core';
import { RfxParallaxComponent } from './components/rfx-parallax/rfx-parallax.component';
import { WillChangeDirective } from './directives/will-change.directive';

@NgModule({
  declarations: [
    RfxParallaxComponent,
    WillChangeDirective
  ],
  imports: [],
  exports: [
    RfxParallaxComponent
  ]
})
export class RfxParallaxModule { }
