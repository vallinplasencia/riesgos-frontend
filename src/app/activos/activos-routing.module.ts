import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivoComponent } from './activo.component';
import { ActivoListarComponent } from './activo-listar/activo-listar.component';

const routes: Routes = [
  {
    path: '', 
    component: ActivoComponent,
    children: [
      { path: '', redirectTo: 'activo' },
      { path: 'activo', component: ActivoListarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivosRoutingModule { }
