# RfxHttpLogger

intercepts every http call and prints the details to the console using [rfx-logger](https://www.npmjs.com/package/rfx-logger) package

![rfx-http-logger](https://i.ibb.co/6wZcg0x/rfx-http-logger.png)

## Features

- No more manual logging inside your code
- All messages are printed with [rfx-logger](https://www.npmjs.com/package/rfx-logger)

## Installation

Install the npm package:
```bash
npm install rfx-http-logger
```

Import module and add interceptor:

```typescript
import { RfxHttpLoggerModule } from 'rfx-http-logger';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    RfxHttpLoggerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RfxHttpLoggerInterceptor,
      multi: true
    }
  ],
})
```

## Demo

TODO

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
