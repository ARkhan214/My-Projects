import { TestBed } from '@angular/core/testing';

import { EmployeeTransactionService } from './employee-transaction-service';

describe('EmployeeTransactionService', () => {
  let service: EmployeeTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
