import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateusercomponent } from './updateusercomponent';

describe('Updateusercomponent', () => {
  let component: Updateusercomponent;
  let fixture: ComponentFixture<Updateusercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Updateusercomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateusercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
