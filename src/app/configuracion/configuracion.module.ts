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
import { TemplateModule } from '../template/template.module';
import { Categoria2ListarComponent } from './categoria/categoria2-listar/categoria2-listar.component';
import { CategoriaMostrarComponent } from './categoria/categoria-mostrar/categoria-mostrar.component';
import { CategoriaEditarComponent } from './categoria/categoria-editar/categoria-editar.component';
import { ProcesoMostrarComponent } from './proceso/proceso-mostrar/proceso-mostrar.component';
import { ProcesoNuevoComponent } from './proceso/proceso-nuevo/proceso-nuevo.component';
import { ProcesoEditarComponent } from './proceso/proceso-editar/proceso-editar.component';
import { ResponsableMostrarComponent } from './responsable/responsable-mostrar/responsable-mostrar.component';
import { ResponsableNuevoComponent } from './responsable/responsable-nuevo/responsable-nuevo.component';
import { ResponsableEditarComponent } from './responsable/responsable-editar/responsable-editar.component';

@NgModule({
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    TemplateModule
  ],
  declarations: [
    ConfiguracionComponent, 
    CategoriaNuevaComponent, 
    CategoriaListarComponent, 
    ProcesoListarComponent, 
    ResponsableListarComponent, 
    Categoria2ListarComponent, 
    CategoriaMostrarComponent, CategoriaEditarComponent, ProcesoMostrarComponent, ProcesoNuevoComponent, ProcesoEditarComponent, ResponsableMostrarComponent, ResponsableNuevoComponent, ResponsableEditarComponent
  ]
})
export class ConfiguracionModule { }
