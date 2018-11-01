import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { PlantillaComponent } from './plantilla/plantilla.component';

import { RouterModule } from "@angular/router";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarConfiguracionComponent } from './sidebar/sidebar-configuracion/sidebar-configuracion.component';
import { SidebarActivoComponent } from './sidebar/sidebar-activo/sidebar-activo.component';
import { ErrorMensajesModeloComponent } from './error-mensajes-modelo/error-mensajes-modelo.component';
import { SnackbarErrorComponent } from './snackbar/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from './snackbar/snackbar-success/snackbar-success.component';
import { HomeComponent } from './home/home.component';

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
    SidebarActivoComponent,
    ErrorMensajesModeloComponent,
    SnackbarErrorComponent,
    SnackbarSuccessComponent,
    HomeComponent,
  ],
  exports:[
    AppMaterialModule,
    PlantillaComponent,
    ErrorMensajesModeloComponent,
  ],
  entryComponents:[
    SnackbarSuccessComponent,
    SnackbarErrorComponent
  ]
})
export class TemplateModule { }
