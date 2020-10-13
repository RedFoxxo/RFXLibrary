import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfxScrollAnimationComponent } from './rfx-scroll-animation.component';

describe('RfxScrollAnimationComponent', () => {
  let component: RfxScrollAnimationComponent;
  let fixture: ComponentFixture<RfxScrollAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfxScrollAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfxScrollAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
