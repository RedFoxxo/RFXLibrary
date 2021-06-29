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
- Message have time ~~and http response time~~
- Intercept HTTP calls and automatically prints message to the console
- Completely disable logger
- Customize data you want to show in development or in production (http code, time, http duration, log types)

## Installation

Install the npm package:
```bash
npm install rfx-logger
```

### Import module and interceptor:

- __interceptor__ is optional 
- `.config` parameters are all optionals except `production`
```typescript
import { RfxLoggerModule, RfxLoggerInterceptor } from 'rfx-logger';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    RfxLoggerModule.config({
      production: environment.production
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

### `production`: _boolean_
_(default value: `false`)_<br>
Environment production variable.
Angular by default store this variable in `../environments/environment` file
(example in 'Import module and interceptor' section).
### `disableLoggerInDevelopment`: _boolean_
_(default value: `false`)_<br>
If true, completely disable all types of messages in development environment.

### `disableLoggerInProduction`: _boolean_
_(default value: `false`)_<br>
If true, completely disable all types of messages in production environment.

### `disableVerboseInDevelopment`: _boolean_
If true, logger doesn't print any debug data in development environment, just a one line message.
### `disableVerboseInProduction`: _boolean_
_(default value: `true`)_<br>
If true, logger doesn't print any debug data in production environment, just a one line message.

### ~~`disableHttpCodesInDevelopment`: _boolean_~~
~~_(default value: `false`)_<br>~~
~~If true, logger doesn't show http code in development environment when http interceptor is used.~~
### ~~`disableHttpcodesInProduction`: _boolean_~~
~~_(default value: `false`)_<br>~~
~~If true, logger doesn't show http code in production environment when http interceptor is used.~~
### ~~`disableHttpCallDurationInDevelopment`: _boolean_~~
~~_(default value: `false`)_<br>~~
~~If true, http calls duration in development environment are hidden~~
### ~~`disableHttpCallDurationInProduction`: _boolean_~~
~~_(default value: `true`)_<br>~~
~~If true, http calls duration in production environment are hidden~~
### `disableTimeInDevelopment`: _boolean_
_(default value: `false`)_<br>
If true, disable time inside log in development environment.

### `disableTimeInProduction`: _boolean_
_(default value: `true`)_<br>
If true, disable time inside log in production environment.

### `developmentEnabledLogs`: _(LogTypeEnum | string)[]_
_(default value: `['success', 'warning', 'error', 'trace']`)_<br>
Types of logs enabled in development environment.
All logs are enabled by default.
### `productionEnabledLogs`: _(LogTypeEnum | string)[]_
_(default value: `['success', 'error']`)_<br>
Types of logs enabled in production environment.<br>
You can use an empty array if you want to completely disable logger in production

### `colorsConfig`: _LogStyleModel[]_
You can customize every message tag, text, time and http response time<br>
This is the default style:
```typescript
colorsConfig: [
  {
    logType: 'success',
    textStyle: 'color: #8BC34A; font-weight: bold; padding: 1px 0;',
    tagStyle: 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px;',
    timeStyle: 'color: #9E9E9E; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
  },
  {
    logType: 'warning',
    textStyle: 'color: #FFC107; font-weight: bold; padding: 1px 0;',
    tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px;',
    timeStyle: 'color: #9E9E9E; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
  },
  {
    logType: 'error',
    textStyle: 'color: #F44336; font-weight: bold; padding: 1px 0;',
    tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px;',
    timeStyle: 'color: #9E9E9E; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
  },
  {
    logType: 'trace',
    textStyle: 'color: #BDBDBD; font-weight: bold; padding: 1px 0;',
    tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px;',
    timeStyle: 'color: #9E9E9E; padding: 1px 0;',
    responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
  }
]
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
this.rfxLoggerService.trace(message, data);      // trace   - gray message
```

## Demo

https://demo.redfoxxo.dev/rfx-logger

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
