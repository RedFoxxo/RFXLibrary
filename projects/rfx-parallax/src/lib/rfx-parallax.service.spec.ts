import { TestBed } from '@angular/core/testing';

import { RfxParallaxService } from './rfx-parallax.service';

describe('RfxParallaxService', () => {
  let service: RfxParallaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfxParallaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
