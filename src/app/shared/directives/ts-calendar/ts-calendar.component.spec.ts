import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TsCalendarComponent } from './ts-calendar.component';

describe('TsCalendarComponent', () => {
  let component: TsCalendarComponent;
  let fixture: ComponentFixture<TsCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
