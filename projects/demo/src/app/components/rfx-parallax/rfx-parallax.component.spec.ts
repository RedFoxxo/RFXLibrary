import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfxParallaxComponent } from './rfx-parallax.component';

describe('RfxParallaxComponent', () => {
  let component: RfxParallaxComponent;
  let fixture: ComponentFixture<RfxParallaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfxParallaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfxParallaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
