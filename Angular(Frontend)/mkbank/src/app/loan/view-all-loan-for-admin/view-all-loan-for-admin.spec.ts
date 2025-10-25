import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLoanForAdmin } from './view-all-loan-for-admin';

describe('ViewAllLoanForAdmin', () => {
  let component: ViewAllLoanForAdmin;
  let fixture: ComponentFixture<ViewAllLoanForAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllLoanForAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllLoanForAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
