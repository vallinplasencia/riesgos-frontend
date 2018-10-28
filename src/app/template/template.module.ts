import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { PlantillaComponent } from './plantilla/plantilla.component';

import { RouterModule } from "@angular/router";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarConfiguracionComponent } from './sidebar/sidebar-configuracion/sidebar-configuracion.component';
import { SidebarActivoComponent } from './sidebar/sidebar-activo/sidebar-activo.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule
  ],
  declarations: [
    PlantillaComponent,
    PageNotFoundComponent,
    SidebarConfiguracionComponent,
    SidebarActivoComponent
  ],
  exports:[
    AppMaterialModule,
    PlantillaComponent,
    // RouterModule
  ]
})
export class TemplateModule { }
