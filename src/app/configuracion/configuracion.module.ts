import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';

import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { CategoriaListarComponent } from './categoria/categoria-listar/categoria-listar.component';
import { ProcesoListarComponent } from './proceso/proceso-listar/proceso-listar.component';
import { ResponsableListarComponent } from './responsable/responsable-listar/responsable-listar.component';

@NgModule({
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
  ],
  declarations: [
    ConfiguracionComponent, 
    CategoriaNuevaComponent, 
    CategoriaListarComponent, 
    ProcesoListarComponent, 
    ResponsableListarComponent
  ]
})
export class ConfiguracionModule { }
