import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Categoria } from '../../acceso-datos/models/categoria';
import { Observable, of, EMPTY } from 'rxjs';
import { CategoriaService } from '../../acceso-datos/repos/categoria.service';
import { take, mergeMap } from 'rxjs/operators';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';

@Injectable({
  providedIn: 'root'
})
export class CategoriaResolverService implements Resolve<ItemData<Categoria|Errorr>>{

  constructor(
    private categoriaRepo: CategoriaService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Categoria|Errorr>>|Observable<never> {
    let id = route.paramMap.get('id');

    return this.categoriaRepo.getCategoria(id).pipe(
      take(1),
      // mergeMap(itemData => {
      //   if (itemData) {
      //     console.log('xxxx');
      //     return of(itemData);
      //   } else { // id not found
      //     console.log('dddddddddddd');
      //     this.router.navigate(['/crisis-center']);
      //     return EMPTY;
      //   }
      // })
    );
  }
  
}
