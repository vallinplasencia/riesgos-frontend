import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoMostrarComponent } from './proceso-mostrar.component';

describe('ProcesoMostrarComponent', () => {
  let component: ProcesoMostrarComponent;
  let fixture: ComponentFixture<ProcesoMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
