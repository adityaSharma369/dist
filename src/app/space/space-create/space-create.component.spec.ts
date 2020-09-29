import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceCreateComponent } from './space-create.component';

describe('SpaceCreateComponent', () => {
  let component: SpaceCreateComponent;
  let fixture: ComponentFixture<SpaceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
