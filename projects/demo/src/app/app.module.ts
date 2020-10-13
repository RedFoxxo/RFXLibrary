import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RfxLoggerModule } from 'rfx-logger';
import { RfxParallaxModule } from 'rfx-parallax';
import { RfxScrollAnimationModule } from 'rfx-scroll-animation';

import {
  HomeComponent, RfxLoggerComponent, RfxParallaxComponent, RfxScrollAnimationComponent
} from './_components';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RfxLoggerComponent,
    RfxParallaxComponent,
    RfxScrollAnimationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RfxLoggerModule,
    RfxParallaxModule,
    RfxScrollAnimationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
