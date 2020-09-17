import { TestBed } from '@angular/core/testing';

import { RfxHttpLoggerInterceptor } from './rfx-http-logger.interceptor';

describe('RfxHttpLoggerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RfxHttpLoggerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RfxHttpLoggerInterceptor = TestBed.inject(RfxHttpLoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
