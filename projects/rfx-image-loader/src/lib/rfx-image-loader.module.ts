import { NgModule } from '@angular/core';
import { RfxImageLoaderDirective } from './rfx-image-loader.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    RfxImageLoaderDirective
  ],
  imports: [
    BrowserAnimationsModule
  ],
  exports: [
    RfxImageLoaderDirective
  ]
})
export class RfxImageLoaderModule { }
