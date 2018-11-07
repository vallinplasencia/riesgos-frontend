import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Proceso } from '../../../acceso-datos/models/proceso';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material';
import { Util } from '../../../util/util';
import { Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ProcesoService } from '../../../acceso-datos/repos/proceso.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';


@Component({
  selector: 'app-proceso-mostrar',
  templateUrl: './proceso-mostrar.component.html',
  styleUrls: ['./proceso-mostrar.component.css']
})
export class ProcesoMostrarComponent implements OnInit {

  proceso: Proceso = null;
  eliminando: boolean = false;

  private ocurrioError: boolean = false;
  private subscriptionEliminar = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService,
    private procesoRepo: ProcesoService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { itemData: ItemData<Proceso | Errorr> }) => {

        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.proceso = data.itemData.data as Proceso;
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.proceso = null;
            let err = data.itemData.data as Errorr;
            this.ocurrioError = true;
            let msj = `Codigo de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;

            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
          default: {
            //Nunca debe de entrar aqui. Puse default por suiguir las normas.   
            this.proceso = null;
            this.ocurrioError = true;
            let msj = 'Codigo de error de la app: Desconocido.';
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
        }
      });
  }

  confirmarEliminacion(event, id: number | string, proceso) {
    event.preventDefault();
    this.snackBar.dismiss();
    this.dialogConfirm.confirm("Se eliminará permanentemente el proceso: " + proceso.toUpperCase() + ".\nDesea eliminarlo de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.eliminar(id);
        }
      });
  }
  private eliminar(id: number | string) {
    this.eliminando = true;
    this.ocurrioError = false;

    this.subscriptionEliminar = this.procesoRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            let proc = data.data as Proceso;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ["Se eliminó correctamente el proceso: ", proc.proceso.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            this.router.navigate(['/configuracion/proceso']);
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;

            let err = data.data as Errorr;
            let msj = `Codigo de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
          default: {
            //Nunca debe de entrar aqui. Puse default por suiguir las normas.
            this.ocurrioError = true;
            let msj = 'Codigo de error de la app: Desconocido.';
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
        }
      });
  }

  cancelarEliminacion() {
    this.eliminando = false;
    // if (this.ocurrioError) {
      this.snackBar.dismiss();
    // }

    if (this.subscriptionEliminar) {
      this.subscriptionEliminar.unsubscribe();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.eliminando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está eliminando una proceso. Cancele primero esta operación para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }

}
