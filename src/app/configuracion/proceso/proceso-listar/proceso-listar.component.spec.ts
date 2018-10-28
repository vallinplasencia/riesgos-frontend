import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoListarComponent } from './proceso-listar.component';

describe('ProcesoListarComponent', () => {
  let component: ProcesoListarComponent;
  let fixture: ComponentFixture<ProcesoListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
