import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyAddUser } from './only-add-user';

describe('OnlyAddUser', () => {
  let component: OnlyAddUser;
  let fixture: ComponentFixture<OnlyAddUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlyAddUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyAddUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
