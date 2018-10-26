import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { PlantillaComponent } from './plantilla/plantilla.component';

import { RouterModule } from "@angular/router";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule
  ],
  declarations: [
    PlantillaComponent,
    PageNotFoundComponent
  ],
  exports:[
    AppMaterialModule,
    PlantillaComponent,
    RouterModule
  ]
})
export class CoreModule { }
