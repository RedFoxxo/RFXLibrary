import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RfxScrollAnimationComponent } from './components/rfx-scroll-animation/rfx-scroll-animation.component';

@NgModule({
  declarations: [
    RfxScrollAnimationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    RfxScrollAnimationComponent
  ]
})
export class RfxScrollAnimationModule { }
