import { TestBed } from '@angular/core/testing';

import { RfxImageLoaderService } from './rfx-image-loader.service';

describe('RfxImageLoaderService', () => {
  let service: RfxImageLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfxImageLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
