import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { ItemData } from '../../../acceso-datos/util/item-data';
import { Errorr } from '../../../acceso-datos/util/errorr';
import { CodigoApp } from '../../../util/http/codigo-app';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Subscription, Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';

@Component({
  selector: 'app-categoria-nueva',
  templateUrl: './categoria-nueva.component.html',
  styleUrls: ['./categoria-nueva.component.css']
})
export class CategoriaNuevaComponent implements OnInit {

  accion = 'salvar';
  enviando: boolean = false;
  errores: Errorr = null;
  subscripSalvar: Subscription = null;

  categoriaForm = new FormGroup({
    categoria: new FormControl('', [Validators.required, Validators.maxLength(5)])
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

            this.snackBar.openFromComponent(SnackbarSuccessComponent, {
              data: `${categ.categoria}`,
              duration: Util.SNACKBAR_DURACION_OK,
            });
            formDirective.resetForm();
            this.categoriaForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate(['/configuracion/categoria']);
            }
            break;
          }
          case CodigoApp.ERROR_VALIDACION: {
            this.errores = data.data as Errorr
            break;
          }
          case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
            let err = data.data as Errorr;
            let msj = `Codigo de error-app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
            console.log(msj);

            this.snackBar.openFromComponent(SnackbarErrorComponent, {
              data: msj,
              duration: Util.SNACKBAR_DURACION_ERROR,
            });
            break;
          }
          default: {
            let err = data.data as Errorr;
            let msj = `Codigo de error-app: Desconocido. Mensaje. ' + err._[0]`;
            console.log(msj);
            this.snackBar.openFromComponent(SnackbarErrorComponent, {
              data: msj,
              duration: Util.SNACKBAR_DURACION_ERROR,
            });
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
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está guardando información. Cancele primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.categoria.value && this.categoria.value.length) {
      if (this.dialogConfirm.confirm('Descartar cambios?')) {
        this.snackBar.dismiss(); //Oculta los sanckbar si se guardo y se navega a otra ruta
        return true;
      } else {
        return false
      }
    }
    this.snackBar.dismiss();
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;
    this.snackBar.dismiss();

    if (this.subscripSalvar) {
      this.subscripSalvar.unsubscribe();
    }
  }
}
