import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyLoan } from './view-my-loan';

describe('ViewMyLoan', () => {
  let component: ViewMyLoan;
  let fixture: ComponentFixture<ViewMyLoan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMyLoan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyLoan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
