import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RfxLoggerModule } from 'rfx-logger';
import { RfxLoggerComponent } from './_components/rfx-logger/rfx-logger.component';
import { HomeComponent } from './_components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    RfxLoggerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RfxLoggerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
