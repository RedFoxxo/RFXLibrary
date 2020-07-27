import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RfxLoggerService } from 'rfx-logger';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RfxLoggerService
  ],
  providers: [RfxLoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
