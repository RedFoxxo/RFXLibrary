import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfxImageLoaderComponent } from './rfx-image-loader.component';

describe('RfxImageLoaderComponent', () => {
  let component: RfxImageLoaderComponent;
  let fixture: ComponentFixture<RfxImageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfxImageLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfxImageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
