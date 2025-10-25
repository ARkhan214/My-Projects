import { TestBed } from '@angular/core/testing';

import { DivitionService } from './divition-service';

describe('DivitionService', () => {
  let service: DivitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
