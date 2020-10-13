# RfxLogger

Upgrade for browser console messages

<img src="https://i.ibb.co/y59MBfV/rfx-logger-1.png" width="350" />
<br />
<img src="https://i.ibb.co/6wZcg0x/rfx-http-logger.png" width="350" />

## Features

- One-line compact view
- All messages have intuitive colors
- Message tag supports HTTP codes
- Intercept HTTP calls and automatically prints message to the console

## Installation

Install the npm package:
```bash
npm install rfx-logger
```

### Import module and interceptor:

- __interceptor__ is optional 
- `.config` is optional if you want to disable debug data (useful for production). Default is `false`
```typescript
import { RfxLoggerModule, RfxLoggerInterceptor } from 'rfx-logger';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    RfxLoggerModule.config({
      disableDebug: true
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RfxLoggerInterceptor,
      multi: true
    }
  ],
})
```

## Usage

* __message__
custom string *(eg. function name)*
* __data__
optional, any object you want to print with the debug message *(eg. backend data)*

```typescript
import { RfxLoggerService } from 'rfx-logger';

[...]

constructor(rfxLoggerService: RfxLoggerService) { }

[...]

this.rfxLoggerService.success(message, data);    // success - green message
this.rfxLoggerService.warning(message, data);    // warning - yellow message
this.rfxLoggerService.error(message, data);      // error   - red message
```

## Demo

https://demo.redfoxxo.dev/rfx-logger

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
