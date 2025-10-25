import { TestBed } from '@angular/core/testing';

import { PolicestationService } from './policestation-service';

describe('PolicestationService', () => {
  let service: PolicestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
