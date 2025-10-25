import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllDPS } from './view-all-dps';

describe('ViewAllDPS', () => {
  let component: ViewAllDPS;
  let fixture: ComponentFixture<ViewAllDPS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllDPS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllDPS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
