import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  mostrar() {
    // this.router.navigate([ { outlets: { submenu: 'configuracion' }}]);
    this.router.navigate([{outlets: {primary: 'categoria/crear' ,sidebar: 'configuracion'}}]);
//     <a [routerLink]="[{ outlets: { primary: ['categoria/crear'],submenu: ['configuracion'] } }]">
//     Products List
//    </a>    
  }
}
