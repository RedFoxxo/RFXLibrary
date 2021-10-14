# RfxParallax

Parallax for elements and images made easy.

## Features

- ~~Apply `libRfxParallax` to your element and enjoy element parallax!~~
- Apply `libRfxParallaxImage`, specify `imageUrl` property and enjoy image parallax!
- Image automatically adapts into its container
- Compatible with **custom scrollbars**
- Dynamically change parallaxed image
- Support image alt property for **accessibility**
- Best performance with `translate` + `will-change`

## Installation

Install with npm package manager:
```bash
npm install rfx-parallax
```
of yarn package manager:
```bash
yarn add rfx-parallax
```

### Import module:

```typescript
import { RfxParallaxModule } from 'rfx-parallax';

@NgModule({
  imports: [
    RfxParallaxModule
  ]
})
```

### Initialize parallax

In your *app.component.ts* initialize parallax listeners inside `ngAfterViewInit`
```typescript
import { RfxParallaxService } from 'rfx-parallax';

constructor(private rfxParallaxService: RfxParallaxService) {}

public ngAfterViewInit(): void {
  this.rfxParallaxService.initListeners();
}
```

and if you have a custom scrollbar component you can pass the nativeElement
to the initListeners() function like this:<br />
```html
<custom-scrollbar #scrollbar>
  <!-- Your page here -->
</custom-scrollbar>
```
```typescript
@ViewChild('scrollbar') public scrollbarElement!: ElementRef;

public ngAfterViewInit(): void {
  this.rfxParallaxService.initListeners(this.scrollbarElement.nativeElement);
}
```

## Usage

### Generic element

Coming soon (`libRfxParallax`)

### Image

just apply `libRfxParallaxImage` to your container and pass the image url
```html
<div libRfxParallaxImage imageUrl="<image-path>"></div>
```

## Configuration

| property | type | default | description |
| --- | :---: | :---: | --- |
| `parallaxPercentage` | number | 40 | percentage of element / image scrolling, e.g. 40% will scroll 40% of the element / image 
| `isDisabled` | boolean | false | set to true if you want to disable element / image parallax. This property restore element position to default and remove adaptive image width / height |
### Properties for image parallax only
| property | type | default | description |
| --- | :---: | :---: | --- |
| `imageUrl` | string | *no default* | image url to load in the container |
| `imageAlt` | string | *empty* | alt text for image |
| `positionPercentage` | number | 50 | image X axis position percentage, e.g. 50% will position image at the center of the container width |
| `imageZIndex` | number | -1 | image z-index property value. Default is -1 so you can see all elements inside the container. *This index applies to the image tag inside the wrapper and not to the wrapper!* |
| `isOverflowVisible` | boolean | false | enable or disable container overflow. If enabled, image will be visible outside of container |
| `isAdaptiveDisabled` | boolean | false | set to true if you want to disable adaptive image width and height and set image width same as the container width. Usefull when you have isOverflowVisible set to true |


<br />

**_Missing configuration parameter?_**<br />
*Request it here: https://github.com/RedFoxxo/RFXLibrary/issues*

<br />

## Demo

https://demo.redfoxxo.dev/rfx-parallax

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
