import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableListarComponent } from './responsable-listar.component';

describe('ResponsableListarComponent', () => {
  let component: ResponsableListarComponent;
  let fixture: ComponentFixture<ResponsableListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsableListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsableListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
