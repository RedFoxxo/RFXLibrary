import { TestBed } from '@angular/core/testing';

import { RfxLoggerInterceptor } from './rfx-logger.interceptor';

describe('RfxLoggerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RfxLoggerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RfxLoggerInterceptor = TestBed.inject(RfxLoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
