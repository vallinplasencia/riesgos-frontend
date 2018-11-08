import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, RouterState } from '@angular/router';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css'],
})
export class PlantillaComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
    // private state: RouterState
  ) {}

  mostrar() {
    // this.router.navigate([ { outlets: { submenu: 'configuracion' }}]);
    this.router.navigate([{outlets: {primary: 'categoria/crear' ,sidebar: 'configuracion'}}]);
//     <a [routerLink]="[{ outlets: { primary: ['categoria/crear'],submenu: ['configuracion'] } }]">
//     Products List
//    </a>    
  }

  /**
   * Clase css q se aplica a los item de la barra superior de navegacion.
   * Tuve q crear este metodo pq parece q hay un bug y no se aplica la clase css a
   * el item de la barra superior con la directiva routerLinkActive.
   */
  aplicarClaseCss(){
    let url = this.router.routerState.snapshot.url;
    let aplicar = false;

    if(url.length){
      let segmentoUrl = url.split('/');
      segmentoUrl.shift();

      if(segmentoUrl.length){
        let segmentoInicial = segmentoUrl.shift();

        switch(segmentoInicial){
          case 'configuracion':
          aplicar = segmentoUrl.some((segmento, idx)=>{
            
            return (idx==0) && (segmento.startsWith('categoria') || segmento.startsWith('proceso') || segmento.startsWith('responsable'));
          });
          break;
        }
      }      
    }
    return aplicar;
  }
}
