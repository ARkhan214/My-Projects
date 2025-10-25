import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewallusercomponent } from './viewallusercomponent';

describe('Viewallusercomponent', () => {
  let component: Viewallusercomponent;
  let fixture: ComponentFixture<Viewallusercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewallusercomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewallusercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
