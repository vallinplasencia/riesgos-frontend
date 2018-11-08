import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Proceso } from '../../../acceso-datos/models/proceso';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ProcesoService } from '../../../acceso-datos/repos/proceso.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';

@Component({
  selector: 'app-proceso-editar',
  templateUrl: './proceso-editar.component.html',
  styleUrls: ['./proceso-editar.component.css']
})
export class ProcesoEditarComponent implements OnInit {
  procesoUpd: Proceso;

  procesoForm = new FormGroup({
    proceso: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  enviando: boolean = false;
  //Errores de validacion
  errores: Errorr = null;
  //Posibilita q si se esta mostrando un snackBar de error se oculte y si es otro snackbar se muestre hasta q se cumpla el tiempo.
  ocurrioError: boolean = false;
  subscripSalvar: Subscription = null;

  constructor(
    private procesoRepo: ProcesoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() {

    this.route.data
      .subscribe((data: { itemData: ItemData<Proceso | Errorr> }) => {
        //Obtengo los datos del resolver
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.procesoUpd = data.itemData.data as Proceso;
            this.procesoForm.patchValue({
              proceso: this.procesoUpd.proceso
            });
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;
            this.procesoUpd = null;
            let err = data.itemData.data as Errorr;
            let msj = `Codigo de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrio un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
          default: {
            //Nunca debe de entrar aqui. Puse default por sueguir las normas. 
            this.ocurrioError = true;
            this.procesoUpd = null;
            let msj = 'Codigo de error-app: Desconocido.';
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrio un problema. Inténtelo mas tarde.', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
        }
      });
  }

  onSubmit(formDirective: FormGroupDirective) {

    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.procesoRepo
      .salvar(this.procesoForm.value, this.procesoUpd.id)
      .subscribe(data => {
        this.enviando = false;
        switch (data.codigo) {

          case CodigoApp.OK: {
            let proc = data.data as Proceso;
            this.procesoUpd = proc;
            this.ocurrioError = false;
            this.errores = null;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardaron correctamente los cambios de el proceso:', proc.proceso],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            // formDirective.resetForm();
            // this.procesoForm.reset();
            this.router.navigate(['/configuracion/proceso'])
            break;
          }
          case CodigoApp.ERROR_VALIDACION: {
            this.ocurrioError = false;//Los errores de validacion no se registran como errores fuertes
            this.errores = data.data as Errorr
            break;
          }
          case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
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
            this.ocurrioError = true;
            let err = data.data as Errorr;
            let msj = `Codigo de error de la app: Desconocido. Mensaje. ${err._[0]}`;
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
      return 'El proceso puede contener hasta 50 caracteres.';
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está guardando información. Cancele primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.procesoUpd && this.procesoUpd.proceso != this.proceso.value) {
      return this.dialogConfirm.confirm("Si continua se perderán los cambios. \nDesea continuar?");
    }
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;
    this.snackBar.dismiss();

    if (this.subscripSalvar) {
      this.subscripSalvar.unsubscribe();
    }
  }

  /**
   * Retorna True si los datos del formulario cambiaron.
   */
  activarBotonSubmit(): boolean {
    return !(this.procesoForm.valid && (this.procesoUpd.proceso != this.proceso.value))
    // return !this.procesoUpd.proceso == this.procesoForm.value
  }
}
