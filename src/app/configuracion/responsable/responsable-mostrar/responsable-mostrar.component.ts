import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Responsable } from '../../../acceso-datos/models/responsable';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material';
import { Util } from '../../../util/util';
import { Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ResponsableService } from '../../../acceso-datos/repos/responsable.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';

@Component({
  selector: 'app-responsable-mostrar',
  templateUrl: './responsable-mostrar.component.html',
  styleUrls: ['./responsable-mostrar.component.css']
})
export class ResponsableMostrarComponent implements OnInit {
  responsable: Responsable = null;
  eliminando: boolean = false;

  private ocurrioError: boolean = false;
  private subscriptionEliminar = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService,
    private responsableRepo: ResponsableService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { itemData: ItemData<Responsable | Errorr> }) => {

        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.responsable = data.itemData.data as Responsable;
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.responsable = null;
            let err = data.itemData.data as Errorr;
            this.ocurrioError = true;
            let msj = `Código de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;

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
            this.responsable = null;
            this.ocurrioError = true;
            let msj = 'Código de error de la app: Desconocido.';
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

  confirmarEliminacion(event, id: number | string, responsable) {
    event.preventDefault();
    this.snackBar.dismiss();
    this.dialogConfirm.confirm("Se le dará de baja permanentemente al responsable: " + responsable.toUpperCase() + ".\nDesea darle de baja de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.eliminar(id);
        }
      });
  }
  private eliminar(id: number | string) {
    this.eliminando = true;
    this.ocurrioError = false;

    this.subscriptionEliminar = this.responsableRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            let resp = data.data as Responsable;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ["Se le dió de baja correctamente al responsable: ", resp.nombre.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            this.router.navigate(['/configuracion/responsable']);
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;

            let err = data.data as Errorr;
            let msj = `Código de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
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
            let msj = 'Código de error de la app: Desconocido.';
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
        'No puede abandonar esta ventana pues se está dando de baja a un responsable. Cancele primero esta operación para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }

}
