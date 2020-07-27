import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfxLoggerComponent } from './rfx-logger.component';

describe('RfxLoggerComponent', () => {
  let component: RfxLoggerComponent;
  let fixture: ComponentFixture<RfxLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfxLoggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfxLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
