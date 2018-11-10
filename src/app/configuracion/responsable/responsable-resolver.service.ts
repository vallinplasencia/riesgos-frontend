import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Responsable } from '../../acceso-datos/models/responsable';
import { Observable, of, EMPTY } from 'rxjs';
import { ResponsableService } from '../../acceso-datos/repos/responsable.service';
import { take, mergeMap } from 'rxjs/operators';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';

@Injectable({
  providedIn: 'root'
})
export class ResponsableResolverService {

  constructor(
    private responsableRepo: ResponsableService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Responsable|Errorr>>|Observable<never> {
    let id = route.paramMap.get('id');

    return this.responsableRepo.getResponsable(id).pipe(
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
