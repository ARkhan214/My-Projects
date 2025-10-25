import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminEmployeeGuard } from './admin-employee-guard';

describe('adminEmployeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminEmployeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
