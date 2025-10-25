import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllEmployee } from './view-all-employee';

describe('ViewAllEmployee', () => {
  let component: ViewAllEmployee;
  let fixture: ComponentFixture<ViewAllEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
