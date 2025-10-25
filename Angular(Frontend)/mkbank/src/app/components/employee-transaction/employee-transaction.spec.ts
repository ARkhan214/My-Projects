import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransaction } from './employee-transaction';

describe('EmployeeTransaction', () => {
  let component: EmployeeTransaction;
  let fixture: ComponentFixture<EmployeeTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
