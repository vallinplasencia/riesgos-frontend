import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { CategoriaListarComponent } from './categoria/categoria-listar/categoria-listar.component';
import { ProcesoListarComponent } from './proceso/proceso-listar/proceso-listar.component';
import { ResponsableListarComponent } from './responsable/responsable-listar/responsable-listar.component';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';
import { Categoria2ListarComponent } from './categoria/categoria2-listar/categoria2-listar.component';
import { CategoriaMostrarComponent } from './categoria/categoria-mostrar/categoria-mostrar.component';
import { CategoriaResolverService } from './categoria/categoria-resolver.service';
import { CategoriaEditarComponent } from './categoria/categoria-editar/categoria-editar.component';
import { ProcesoMostrarComponent } from './proceso/proceso-mostrar/proceso-mostrar.component';
import { ProcesoResolverService } from './proceso/proceso-resolver.service';
import { ProcesoNuevoComponent } from './proceso/proceso-nuevo/proceso-nuevo.component';
import { ProcesoEditarComponent } from './proceso/proceso-editar/proceso-editar.component';
import { ResponsableMostrarComponent } from './responsable/responsable-mostrar/responsable-mostrar.component';
import { ResponsableResolverService } from './responsable/responsable-resolver.service';
import { ResponsableNuevoComponent } from './responsable/responsable-nuevo/responsable-nuevo.component';
import { ResponsableEditarComponent } from './responsable/responsable-editar/responsable-editar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'categoria',
        component: ConfiguracionComponent,
        children: [
          {
            path: '',
            component: CategoriaListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          // { path: 'c2ategoria', component: Categoria2ListarComponent },      
          {
            path: 'nueva',
            component: CategoriaNuevaComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'editar/:id',
            component: CategoriaEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: CategoriaResolverService
            }
          },
          {
            path: ':id',
            component: CategoriaMostrarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: CategoriaResolverService
            }
          },
        ]
      },
      {
        path: 'proceso',
        component: ConfiguracionComponent,
        children: [
          {
            path: '',
            component: ProcesoListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'nuevo',
            component: ProcesoNuevoComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'editar/:id',
            component: ProcesoEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ProcesoResolverService
            }
          },
          {
            path: ':id',
            component: ProcesoMostrarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ProcesoResolverService
            }
          },
        ]
      },
      {
        path: 'responsable',
        component: ConfiguracionComponent,
        children: [
          {
            path: '',
            component: ResponsableListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'nuevo',
            component: ResponsableNuevoComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'editar/:id',
            component: ResponsableEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ResponsableResolverService
            }
          },
          {
            path: ':id',
            component: ResponsableMostrarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ResponsableResolverService
            }
          },
        ]
      }
    ]
  },
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
