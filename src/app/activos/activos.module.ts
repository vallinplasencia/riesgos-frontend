import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivosRoutingModule } from './activos-routing.module';
import { ActivoListarComponent } from './activo-listar/activo-listar.component';
import { ActivoComponent } from './activo.component';

@NgModule({
  imports: [
    CommonModule,
    ActivosRoutingModule
  ],
  declarations: [ActivoListarComponent, ActivoComponent]
})
export class ActivosModule { }
