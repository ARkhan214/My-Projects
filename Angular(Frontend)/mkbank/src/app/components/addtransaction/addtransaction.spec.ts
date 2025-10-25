import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtransaction } from './addtransaction';

describe('Addtransaction', () => {
  let component: Addtransaction;
  let fixture: ComponentFixture<Addtransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addtransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addtransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
