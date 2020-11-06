# RfxParallax

Parallax made easy

## Features

- Apply directive to your component and enjoy
- Image automatically adapts into its container
- Compatible with custom scrollbars
- Disable / enable **parallax**
- Disable / enable parallax container **overflow**
- Configurable image **scroll percentage**, **z-index** and **zoom position**
- Best performance with `translate3d`
- ~~Asynchronous browser scrolling disabled for better performance~~ (Coming soon)

## Installation

Install the npm package:
```bash
npm install rfx-parallax
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

In your *app.component.ts* initialize parallax listeners inside `ngOnInit`
```typescript
import { RfxParallaxService } from 'rfx-parallax';

constructor(private rfxParallaxService: RfxParallaxService) {}

public ngOnInit(): void {
  this.rfxParallaxService.initListeners();
}
```

and if you have a custom scrollbar component you can pass the nativeElement
to the initListeners() function like this:<br />
**WARNING:** *use `ngAfterViewInit` instead of `ngOnInit` otherwise your nativeElement
may not be defined*
```html
<custom-scrollbar #scrollbar>
  <!-- Your page here -->
</custom-scrollbar>
```
```typescript
@ViewChild('scrollbar') public scrollbarElement: ElementRef;

public ngAfterViewInit(): void {
  this.rfxParallaxService.initListeners(this.scrollbarElement.nativeElement);
}
```

## Usage

just apply `libRfxParallax` to your container and pass the image url
```html
<div libRfxParallax imageUrl="<image-path>"></div>
```

## Configuration

### ``parallaxPercentage: number``
*(default value: 40)*<br />
percentage of image scrolling, e.g. 40% will scroll 40% of the image

### ``positionPercentage: number``
*(default value: 50)*<br />
image zoom position in percentage, e.g. 50% will zoom to the center

### ``imageZIndex: number``
*(default value: -1)*<br />
z-index property of the image

### ``visibleOverflow: boolean``
*(default value: false)*<br />
container overflow

### ``isDisabled: boolean``
*(default value: false)*<br />
is parallax disabled

<br />

**_Missing configuration parameter?_**<br />
*Request it here: https://github.com/RedFoxxo/RFXLibrary/issues*

<br />

## Demo

https://demo.redfoxxo.dev/rfx-parallax

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
