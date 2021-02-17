import { TestBed } from '@angular/core/testing';

import { RfxLoaderListenersService } from './rfx-loader-listeners.service';

describe('RfxLoaderListenersService', () => {
  let service: RfxLoaderListenersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfxLoaderListenersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
