import { TestBed } from '@angular/core/testing';

import { LoanPayService } from './loan-pay-service';

describe('LoanPayService', () => {
  let service: LoanPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
