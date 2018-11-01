import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMensajesModeloComponent } from './error-mensajes-modelo.component';

describe('ErrorMensajesModeloComponent', () => {
  let component: ErrorMensajesModeloComponent;
  let fixture: ComponentFixture<ErrorMensajesModeloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMensajesModeloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMensajesModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
