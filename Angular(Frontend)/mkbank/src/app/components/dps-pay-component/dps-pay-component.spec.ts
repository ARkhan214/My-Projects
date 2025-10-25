import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsPayComponent } from './dps-pay-component';

describe('DpsPayComponent', () => {
  let component: DpsPayComponent;
  let fixture: ComponentFixture<DpsPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpsPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
