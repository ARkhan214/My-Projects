import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStatement } from './transaction-statement';

describe('TransactionStatement', () => {
  let component: TransactionStatement;
  let fixture: ComponentFixture<TransactionStatement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionStatement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionStatement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
