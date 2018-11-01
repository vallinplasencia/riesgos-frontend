import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './template/page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { SidebarConfiguracionComponent } from './template/sidebar/sidebar-configuracion/sidebar-configuracion.component';
import { SidebarActivoComponent } from './template/sidebar/sidebar-activo/sidebar-activo.component';
import { HomeComponent } from './template/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'configuracion',
    loadChildren: "./configuracion/configuracion.module#ConfiguracionModule"
  },
  {
    path: 'activos',
    loadChildren: "./activos/activos.module#ActivosModule"
  },
  
  //****Rutas de Sidebar. Rutas secundarias. Outlet nombrado con sidebar
  {
    path: 'configuracion',
    component: SidebarConfiguracionComponent,
    outlet: 'sidebar'
  },
  {
    path: 'activo',
    component: SidebarActivoComponent,
    outlet: 'sidebar'
  },
  //****FIN. Rutas de Sidebar...
  //Rutas que no se encuentran en la app.
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
