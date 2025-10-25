import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoanApproveComponent } from './admin-loan-approve-component';

describe('AdminLoanApproveComponent', () => {
  let component: AdminLoanApproveComponent;
  let fixture: ComponentFixture<AdminLoanApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLoanApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoanApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
