import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLoan } from './pay-loan';

describe('PayLoan', () => {
  let component: PayLoan;
  let fixture: ComponentFixture<PayLoan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayLoan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLoan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
