import { TestBed } from '@angular/core/testing';

import { RfxLoggerService } from './rfx-logger.service';

describe('RfxLoggerService', () => {
  let service: RfxLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfxLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
