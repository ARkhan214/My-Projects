import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllFd } from './view-all-fd';

describe('ViewAllFd', () => {
  let component: ViewAllFd;
  let fixture: ComponentFixture<ViewAllFd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllFd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllFd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
