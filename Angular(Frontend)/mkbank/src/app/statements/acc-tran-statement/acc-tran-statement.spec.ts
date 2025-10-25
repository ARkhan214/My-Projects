import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccTranStatement } from './acc-tran-statement';

describe('AccTranStatement', () => {
  let component: AccTranStatement;
  let fixture: ComponentFixture<AccTranStatement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccTranStatement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccTranStatement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
