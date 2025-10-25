import { TestBed } from '@angular/core/testing';

import { Accountsservice } from './accountsservice';

describe('Accountsservice', () => {
  let service: Accountsservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accountsservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
