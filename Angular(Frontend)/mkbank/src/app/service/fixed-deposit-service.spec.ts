import { TestBed } from '@angular/core/testing';

import { FixedDepositService } from './fixed-deposit-service';

describe('FixedDepositService', () => {
  let service: FixedDepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedDepositService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
