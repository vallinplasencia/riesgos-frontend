import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableMostrarComponent } from './responsable-mostrar.component';

describe('ResponsableMostrarComponent', () => {
  let component: ResponsableMostrarComponent;
  let fixture: ComponentFixture<ResponsableMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsableMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsableMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
