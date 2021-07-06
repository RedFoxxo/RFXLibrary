# RfxLogger

Upgrade for browser console messages

<img src="https://i.ibb.co/L6MSKnB/nice.png" width="350" />
<br />
<img src="https://i.ibb.co/6wZcg0x/rfx-http-logger.png" width="350" />

## Features

- One-line compact view
- Non-intrusive debug data
- Messages have customizable colors
- Message tag support HTTP codes
- Message have time and http response time
- Intercept HTTP calls and automatically prints message to the console
- Completely disable logger
- Customize data you want to show (http code, time, http duration, log types)

## Installation

Install the npm package:
```bash
npm install rfx-logger
```

### Import module and interceptor:

- __interceptor__ is optional 
- `.config` is optional
```typescript
import { RfxLoggerModule, RfxLoggerInterceptor } from 'rfx-logger';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    RfxLoggerModule.config({
      [ ... ]
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

## Module configuration

### `disableLogger`: _boolean_
_(default value: `false`)_<br>
If true, completely disable all types of messages.

### `disableVerbose`: _boolean_
_(default value: `false`)_<br>
If true, logger doesn't print any debug data, just a one line message.

### ~~`disableHttpCodes`: _boolean_~~
~~_(default value: `false`)_<br>~~
~~If true, logger doesn't show http code when http interceptor is used.~~

### `disableHttpCallDuration`: _boolean_
_(default value: `false`)_<br>
If true, http calls duration are hidden

### `disableTime`: _boolean_
_(default value: `false`)_<br>
If true, disable time inside console log.

### `enabledLogs`: _(LogTypeEnum | string)[]_
_(default value: `['success', 'warning', 'error', 'trace']`)_<br>
Enable only selected types of log.
All logs are enabled by default.

### `colorsConfig`: _LogStyleModel[]_
You can customize every message tag, text, time and http response time<br>
This is the default style:
```typescript
colorsConfig: [
  {
    logType: 'success',
    tagStyle: 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px; margin-left: 2px;',
    textStyle: 'color: #8BC34A; font-weight: bold; padding: 1px 0;',
    timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
  },
  {
    logType: 'warning',
    tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px; margin-left: 2px;',
    textStyle: 'color: #FFC107; font-weight: bold; padding: 1px 0;',
    timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
  },
  {
    logType: 'error',
    tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px; margin-left: 2px;',
    textStyle: 'color: #F44336; font-weight: bold; padding: 1px 0;',
    timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
  },
  {
    logType: 'trace',
    tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px; margin-left: 2px;',
    textStyle: 'color: #BDBDBD; font-weight: bold; padding: 1px 0;',
    timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
  }
]
```


## Usage

* __message__
custom string *(eg. function name)*
* __data__
optional, any object you want to print with the console message *(eg. backend data)*

```typescript
import { RfxLoggerService } from 'rfx-logger';

[...]

constructor(rfxLoggerService: RfxLoggerService) { }

[...]

this.rfxLoggerService.success(message, data);    // success - green message
this.rfxLoggerService.warning(message, data);    // warning - yellow message
this.rfxLoggerService.error(message, data);      // error   - red message
this.rfxLoggerService.trace(message, data);      // trace   - gray message
```

## Demo

https://demo.redfoxxo.dev/rfx-logger

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
