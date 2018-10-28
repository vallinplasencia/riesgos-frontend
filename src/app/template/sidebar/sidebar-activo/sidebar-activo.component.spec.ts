import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarActivoComponent } from './sidebar-activo.component';

describe('SidebarActivoComponent', () => {
  let component: SidebarActivoComponent;
  let fixture: ComponentFixture<SidebarActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
