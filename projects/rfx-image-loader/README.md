# RfxImageLoader
Better image loading

## Features

- Customize fade-in duration
- Customize fade-in timing function
- ~~add your content to image (eg. loader)~~

## Installation

Install the npm package:
```bash
npm install rfx-image-loader
```

### Import module:

```typescript
import { RfxImageLoaderModule } from 'rfx-image-loader';

@NgModule({
  imports: [
    RfxImageLoaderModule
  ]
})
```

## Usage

### 1. add `libRfxImageLoader` to your container
```html
<div libRfxImageLoader></div>
```

### 2. pass array of images (RfxImageInterface) to `[imageUrls]`
```typescript
public images: RfxImageInterface[];

[...]

this.images = [
  { imageUrl: './assets/image.jpg', priority: 2 },
  { imageUrl: './assets/placeholder_super_low_quality.jpg', priority: 0 }
  { imageUrl: './assets/placeholder_low_quality.jpg', priority: 1 }
];
```
```html
<div libRfxImageLoader [imageUrls]="images"></div>
```
### 3. pass **ORIGINAL** image width and height to the component
_(eg. width: `8480px`, height: `5600px`)_
```html
<div libRfxImageLoader [imageUrls]="images" [imageWidthPx]="8480" [imageHeightPx]="5600"></div>
```
### 4. set image placeholder color (optional)
```html
<div libRfxImageLoader [imageUrls]="images" [imageWidthPx]="8480" [imageHeightPx]="5600" placeholderColor="#fafafa"></div>
```

## Configuration

### ``imageUrls: RfxImageInterface[]``
- array of image urls with priority;
- lower priority = lower quality image;
- the highest priority is the main image.

#### **RfxImageInterface:**
```typescript
interface RfxImageInterface {
  imageUrl: string;
  priority: number;
}
```

### ``placeholderColor: string``
_(default value: "transparent")_

### ``imageWidthPx: number``
**ORIGINAL** image width in pixels

### ``imageHeightPx: number``
**ORIGINAL** image height in pixels

### ``animationDurationMs: number``
_(default value: 300)_
animation duration in milliseconds

### ``animationTimingFunction: string``
_(default value: "cubic-bezier(0.4, 0.0, 0.2, 1)")_
animation timing function

### ~~``onImageLoaded: EventEmitter<boolean>``~~

## Demo

TODO

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
