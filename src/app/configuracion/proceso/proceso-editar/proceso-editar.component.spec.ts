import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoEditarComponent } from './proceso-editar.component';

describe('ProcesoEditarComponent', () => {
  let component: ProcesoEditarComponent;
  let fixture: ComponentFixture<ProcesoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
