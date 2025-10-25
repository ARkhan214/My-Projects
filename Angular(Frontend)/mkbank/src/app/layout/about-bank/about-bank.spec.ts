import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBank } from './about-bank';

describe('AboutBank', () => {
  let component: AboutBank;
  let fixture: ComponentFixture<AboutBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
