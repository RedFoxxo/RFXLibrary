# RfxParallax

Parallax made easy

## Features

- Apply directive to your component and enjoy
- Image automatically adapts into its container
- Compatible with custom scrollbars
- Disable / enable **parallax**
- Disable / enable parallax container **overflow**
- Configurable image **scroll percentage** and **z-index**

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
to the initListeners() function like this:
```html
<custom-scrollbar #scrollbar>
  <!-- Your page here -->
</custom-scrollbar>
```
```typescript
@ViewChild('scrollbar') scrollBarElement: ElementRef;

public ngOnInit(): void {
  this.rfxParallaxService.initListeners(scrollbarElement.nativeElement);
}
```

## Usage

just apply `libRfxParallax` to your container and pass the image url
```html
<div libRfxParallax imageUrl="<image-path>"></div>
```

## Configuration

### ``parallaxPercentage: number``
*(default value: 20)*<br />
percentage of image scrolling, e.g. 30% will scroll 30% of the image

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

## Demo

TODO (Coming soon)

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
