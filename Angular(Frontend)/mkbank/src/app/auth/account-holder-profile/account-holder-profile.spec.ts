import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHolderProfile } from './account-holder-profile';

describe('AccountHolderProfile', () => {
  let component: AccountHolderProfile;
  let fixture: ComponentFixture<AccountHolderProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHolderProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountHolderProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
