import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { ProcesoService } from '../../../acceso-datos/repos/proceso.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { Proceso } from '../../../acceso-datos/models/proceso';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Subscription, Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-proceso-nuevo',
  templateUrl: './proceso-nuevo.component.html',
  styleUrls: ['./proceso-nuevo.component.css']
})
export class ProcesoNuevoComponent implements OnInit {
  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;

  procesoForm = new FormGroup({
    proceso: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private repo: ProcesoService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .salvar(this.procesoForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let proc = data.data as Proceso;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardó correctamente el proceso:', proc.proceso],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.procesoForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate(['/configuracion/proceso']);
            }
            break;
          }
          case CodigoApp.ERROR_VALIDACION: {
            this.errores = data.data as Errorr;
            this.ocurrioError = false; //False pq errores de validacion no entra en errores generales 
            break;
          }
          case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
            let err = data.data as Errorr;
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
            let err = data.data as Errorr;
            this.ocurrioError = true;
            let msj = `Codigo de error de la app: Desconocido. Mensaje. ${err._[0]}`;

            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            })
            break;
          }
        }
      });
  }

  /**
   * Retorna el campo proceso(FormControl)
   */
  get proceso() {
    return this.procesoForm.get('proceso');
  }

  /**
   * Retorna el mensaje de error asociado al campo q no cumpla
   */
  getErrorMessage() {
    if (this.proceso.hasError('required')) {
      return 'Proporcione un valor para el proceso.';
    }
    if (this.proceso.hasError('maxlength')) {
      return 'EL proceso puede contener hasta 50 caracteres.';
    }
  }

  /**
   * Metodo q se va a llamar cuando se intente abandonar la url actual.
   * Este metodo se llama a traves de el Guard Deactivate (util/guards/CanDeactivate)
   * 
   * @returns True abandona la ruta actual hacia la proxima 
   * ruta sino (False) se mantine en la ruta actual.
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está guardando información. Cancele esta operación primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.proceso.value && this.proceso.value.length) {
      return this.dialogConfirm.confirm("Si continua se perderán los cambios.\nDesea continuar?");
    }
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;

    // if (this.ocurrioError) {
      this.snackBar.dismiss();
    // }
    if (this.subscripSalvar) {
      this.subscripSalvar.unsubscribe();
    }
  }

}
