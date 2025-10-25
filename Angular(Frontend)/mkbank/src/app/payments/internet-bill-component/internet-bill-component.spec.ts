import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetBillComponent } from './internet-bill-component';

describe('InternetBillComponent', () => {
  let component: InternetBillComponent;
  let fixture: ComponentFixture<InternetBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternetBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternetBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
