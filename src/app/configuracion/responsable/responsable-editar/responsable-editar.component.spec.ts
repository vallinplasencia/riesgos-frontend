import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableEditarComponent } from './responsable-editar.component';

describe('ResponsableEditarComponent', () => {
  let component: ResponsableEditarComponent;
  let fixture: ComponentFixture<ResponsableEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsableEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsableEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
