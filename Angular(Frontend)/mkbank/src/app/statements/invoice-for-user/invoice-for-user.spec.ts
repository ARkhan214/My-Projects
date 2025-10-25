import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceForUser } from './invoice-for-user';

describe('InvoiceForUser', () => {
  let component: InvoiceForUser;
  let fixture: ComponentFixture<InvoiceForUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceForUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceForUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
