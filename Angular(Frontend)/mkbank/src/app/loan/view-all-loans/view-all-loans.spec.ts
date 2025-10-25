import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLoans } from './view-all-loans';

describe('ViewAllLoans', () => {
  let component: ViewAllLoans;
  let fixture: ComponentFixture<ViewAllLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllLoans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
