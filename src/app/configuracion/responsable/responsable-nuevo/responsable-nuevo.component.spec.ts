import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableNuevoComponent } from './responsable-nuevo.component';

describe('ResponsableNuevoComponent', () => {
  let component: ResponsableNuevoComponent;
  let fixture: ComponentFixture<ResponsableNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsableNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsableNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
