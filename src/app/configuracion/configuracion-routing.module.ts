import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { CategoriaListarComponent } from './categoria/categoria-listar/categoria-listar.component';
import { ProcesoListarComponent } from './proceso/proceso-listar/proceso-listar.component';
import { ResponsableListarComponent } from './responsable/responsable-listar/responsable-listar.component';

const routes: Routes = [
  { 
    path: '', 
    component: ConfiguracionComponent,
    children: [  
      { path: '', redirectTo: 'categoria' },  
      { path: 'categoria', component: CategoriaListarComponent },
      { path: 'categoria/nueva', component: CategoriaNuevaComponent },      
      { path: 'proceso', component: ProcesoListarComponent },
      { path: 'responsable', component: ResponsableListarComponent },      
    ]
   }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ConfiguracionRoutingModule { }
