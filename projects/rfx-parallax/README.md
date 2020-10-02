# RfxParallax

Parallax made easy

## Features

- Apply directive to your component and enjoy
- Image automatically adapts into its container
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

## Usage

just apply `libRfxParallax` to your container and pass the image url
```html
<div libRfxParallax imageUrl="<image-path>"></div>
```

## Configuration

### ``parallaxPercentage: number``
*(default value: 20)*<br />
percentage of image scrolling, e.g. 30% will scroll 30% of the image

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

TODO

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
