import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllAccounts } from './view-all-accounts';

describe('ViewAllAccounts', () => {
  let component: ViewAllAccounts;
  let fixture: ComponentFixture<ViewAllAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
