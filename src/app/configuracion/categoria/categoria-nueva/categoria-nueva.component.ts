import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Subscription, Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-categoria-nueva',
  templateUrl: './categoria-nueva.component.html',
  styleUrls: ['./categoria-nueva.component.css']
})
export class CategoriaNuevaComponent implements OnInit {

  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;

  categoriaForm = new FormGroup({
    categoria: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private repo: CategoriaService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .salvar(this.categoriaForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let categ = data.data as Categoria;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardó correctamente la categoria:', categ.categoria],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.categoriaForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate(['/configuracion/categoria']);
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
            let err = data.data as Errorr;
            this.ocurrioError = true;
            let msj = `Código de error de la app: Desconocido. Mensaje. ${err._[0]}`;

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
   * Retorna el campo categoria(FormControl)
   */
  get categoria() {
    return this.categoriaForm.get('categoria');
  }

  /**
   * Retorna el mensaje de error asociado al campo q no cumpla
   */
  getErrorMessage() {
    if (this.categoria.hasError('required')) {
      return 'Proporcione un valor para la categoria.';
    }
    if (this.categoria.hasError('maxlength')) {
      return 'La categoria puede contener hasta 50 caracteres.';
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
    if (this.categoria.value && this.categoria.value.length) {
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
