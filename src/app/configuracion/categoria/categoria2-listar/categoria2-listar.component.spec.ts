import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Categoria2ListarComponent } from './categoria2-listar.component';

describe('Categoria2ListarComponent', () => {
  let component: Categoria2ListarComponent;
  let fixture: ComponentFixture<Categoria2ListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Categoria2ListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Categoria2ListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
