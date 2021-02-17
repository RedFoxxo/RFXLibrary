import { Component } from '@angular/core';
import { RfxImageInterface } from 'rfx-image-loader';

@Component({
  templateUrl: './rfx-image-loader.component.html',
  styleUrls: ['./rfx-image-loader.component.less']
})
export class RfxImageLoaderComponent {
  public images: RfxImageInterface[];

  constructor() {
    this.images = [
      { imageUrl: './assets/image.jpg', priority: 1 },
      { imageUrl: './assets/placeholder.jpg', priority: 0 }
    ];
  }
}
