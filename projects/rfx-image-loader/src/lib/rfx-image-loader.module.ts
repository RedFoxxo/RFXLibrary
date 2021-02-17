import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RfxImageLoaderComponent } from './_components';
import { SortImagesByPriorityPipe } from './_pipes';

@NgModule({
  declarations: [
    RfxImageLoaderComponent,
    SortImagesByPriorityPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [
    RfxImageLoaderComponent
  ],
  providers: [
    SortImagesByPriorityPipe
  ]
})
export class RfxImageLoaderModule { }
