import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.css']
})
export class CategoriaEditarComponent implements OnInit {
  categoriaUpd: Categoria;

  categoriaForm = new FormGroup({
    categoria: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  enviando: boolean = false;
  //Errores de validacion
  errores: Errorr = null;
  //Posibilita q si se esta mostrando un snackBar de error se oculte y si es otro snackbar se muestre hasta q se cumpla el tiempo.
  ocurrioError: boolean = false;
  subscripSalvar: Subscription = null;

  constructor(
    private categoriaRepo: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() {

    this.route.data
      .subscribe((data: { itemData: ItemData<Categoria | Errorr> }) => {
        //Obtengo los datos del resolver
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.categoriaUpd = data.itemData.data as Categoria;
            this.categoriaForm.patchValue({
              categoria: this.categoriaUpd.categoria
            });
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;
            this.categoriaUpd = null;
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
            this.categoriaUpd = null;
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

    this.subscripSalvar = this.categoriaRepo
      .salvar(this.categoriaForm.value, this.categoriaUpd.id)
      .subscribe(data => {
        this.enviando = false;
        switch (data.codigo) {

          case CodigoApp.OK: {
            let categ = data.data as Categoria;
            this.categoriaUpd = categ;
            this.ocurrioError = false;
            this.errores = null;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardaron correctamente los cambios de la categoria:', categ.categoria],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            // formDirective.resetForm();
            // this.categoriaForm.reset();
            this.router.navigate(['/configuracion/categoria'])
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
    if (this.categoriaUpd && this.categoriaUpd.categoria != this.categoria.value) {
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
    return !(this.categoriaForm.valid && (this.categoriaUpd.categoria != this.categoria.value))
    // return !this.categoriaUpd.categoria == this.categoriaForm.value
  }

}
