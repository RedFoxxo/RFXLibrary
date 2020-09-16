# RfxLogger

An upgrade for your console messages

![rfx-logger](https://i.ibb.co/y59MBfV/rfx-logger-1.png)

## Features

- One-line compact view
- All messages have intuitive colors
- Message tag supports HTTP codes

## Installation

Install the npm package:
```bash
npm install rfx-logger
```

Import module:

`config` is optional if you want to disable debug data. Default is `false`
```typescript
import { RfxLoggerModule } from 'rfx-logger';

@NgModule({
    imports: [
      RfxLoggerModule.config({
        disableDebug: true        // true = disabled debug data (useful for production)
      })
    ]
})
```

## Usage

```typescript
  import { RfxLoggerService } from 'rfx-logger';

  [...]

  constructor(rfxLoggerService: RfxLoggerService) { }

  [...]

  this.rfxLoggerService.success(title, data);    // success - green message
  this.rfxLoggerService.warning(title, data);    // warning - yellow message
  this.rfxLoggerService.error(title, data);      // error   - red message
```

* __title__
custom string *(eg. function name)*

* __data__
optional, any object you want to print with the debug message *(eg. backend data)*

## Demo

TODO

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
