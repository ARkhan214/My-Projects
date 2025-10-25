import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userEmployeeGuard } from './user-employee-guard';

describe('userEmployeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userEmployeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
