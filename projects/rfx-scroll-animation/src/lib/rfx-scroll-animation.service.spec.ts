import { TestBed } from '@angular/core/testing';

import { RfxScrollAnimationService } from './rfx-scroll-animation.service';

describe('RfxScrollAnimationService', () => {
  let service: RfxScrollAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfxScrollAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
