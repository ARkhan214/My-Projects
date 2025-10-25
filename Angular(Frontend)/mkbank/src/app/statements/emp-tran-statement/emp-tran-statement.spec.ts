import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTranStatement } from './emp-tran-statement';

describe('EmpTranStatement', () => {
  let component: EmpTranStatement;
  let fixture: ComponentFixture<EmpTranStatement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpTranStatement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpTranStatement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
