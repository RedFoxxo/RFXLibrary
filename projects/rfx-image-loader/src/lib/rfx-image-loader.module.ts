import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { RfxImageLoaderComponent } from './_components';
import { SortImagesByPriorityPipe } from './_pipes';

@NgModule({
  declarations: [
    RfxImageLoaderComponent,
    SortImagesByPriorityPipe
  ],
  exports: [
    RfxImageLoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    SortImagesByPriorityPipe,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class RfxImageLoaderModule { }
