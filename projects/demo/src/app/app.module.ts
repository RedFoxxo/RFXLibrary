import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

import {
  HomeComponent, RfxLoggerComponent, RfxParallaxComponent, RfxScrollAnimationComponent,
  RfxImageLoaderComponent
} from './_components';

import { RfxImageLoaderModule } from 'rfx-image-loader';
import { RfxLoggerModule } from 'rfx-logger';
import { RfxParallaxModule } from 'rfx-parallax';
import { RfxScrollAnimationModule } from 'rfx-scroll-animation';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RfxLoggerComponent,
    RfxParallaxComponent,
    RfxScrollAnimationComponent,
    RfxImageLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RfxLoggerModule.config({
      production: environment.production,
      productionEnabledLogs: ['success', 'warning', 'error', 'trace']
    }),
    RfxParallaxModule,
    RfxScrollAnimationModule,
    RfxImageLoaderModule,
    NgScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
