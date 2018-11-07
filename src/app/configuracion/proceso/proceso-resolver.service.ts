import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Proceso } from '../../acceso-datos/models/proceso';
import { Observable, of, EMPTY } from 'rxjs';
import { ProcesoService } from '../../acceso-datos/repos/proceso.service';
import { take, mergeMap } from 'rxjs/operators';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';

@Injectable({
  providedIn: 'root'
})
export class ProcesoResolverService implements Resolve<ItemData<Proceso|Errorr>>{

  constructor(
    private procesoRepo: ProcesoService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Proceso|Errorr>>|Observable<never> {
    let id = route.paramMap.get('id');

    return this.procesoRepo.getProceso(id).pipe(
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
