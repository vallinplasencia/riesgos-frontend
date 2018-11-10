import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';
import { ResponsableService } from '../../../acceso-datos/repos/responsable.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { Responsable } from '../../../acceso-datos/models/responsable';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Subscription, Observable } from 'rxjs';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-responsable-nuevo',
  templateUrl: './responsable-nuevo.component.html',
  styleUrls: ['./responsable-nuevo.component.css']
})
export class ResponsableNuevoComponent implements OnInit {

  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;

  responsableForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    funcion : ['', [Validators.required, Validators.maxLength(70)]],
    area: ['', [Validators.required, Validators.maxLength(70)]],
    direccion: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), Validators.email]]
  });

  // responsableForm = this.fb.group({
  //   nombre: ['', [Validators.required, Validators.maxLength(2)]],
  //   funcion : ['', [Validators.required, Validators.maxLength(2)]],
  //   area: ['', [Validators.required, Validators.maxLength(2)]],
  //   direccion: ['', [Validators.required, Validators.maxLength(2)]],
  //   email: ['', [Validators.required, Validators.maxLength(6), Validators.email]]
  // });


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private repo: ResponsableService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .salvar(this.responsableForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let resp = data.data as Responsable;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardó correctamente el responsable:', resp.nombre],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.responsableForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate(['/configuracion/responsable']);
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
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {
    
    switch (campo) {
      case 'nombre': {
        if (this.nombre.hasError('required')) {
          return 'Proporcione un valor para el nombre.';
        }
        if (this.nombre.hasError('maxlength')) {
          
          return 'El nombre puede contener hasta 100 caracteres.';
        }
        break;
      }
      case 'funcion': {
        if (this.funcion.hasError('required')) {
          return "Proporcione un valor para el campo función.";
        }
        if (this.funcion.hasError('maxlength')) {
          return 'El campo función puede contener hasta 70 caracteres.';
        }
        break;
      }
      case 'area': {
        if (this.area.hasError('required')) {
          return 'Proporcione un valor para el campo área.';
        }
        if (this.area.hasError('maxlength')) {
          return 'El campo área puede contener hasta 70 caracteres.';
        }
        break;
      }
      case 'direccion': {
        if (this.direccion.hasError('required')) {
          return 'Proporcione un valor para el campo dirección.';
        }
        if (this.direccion.hasError('maxlength')) {
          return 'El campo dirección puede contener hasta 100 caracteres.';
        }
        break;
      }
      case 'email': {
        if (this.email.hasError('required')) {
          return 'Proporcione un valor para el correo electrónico.';
        }
        if (this.email.hasError('maxlength')) {
          return 'El correo electrónico puede contener hasta 100 caracteres.';
        }
        if (this.email.hasError('email')) {
          return 'El campo email tiene que ser un correo electrónico válido.';
        }
        break;
      }
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
    if (this.nombre.value && this.nombre.value.length) {
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

  /**
   * Retorna el campo responsable(FormControl)
   */
  get nombre() {
    return this.responsableForm.get('nombre');
  }
  get funcion() {
    return this.responsableForm.get('funcion');
  }
  get area() {
    return this.responsableForm.get('area');
  } 
  get direccion() {
    return this.responsableForm.get('direccion');
  } 
  get email() {
    return this.responsableForm.get('email');
  } 
  // get fechaAlta() {
  //   return this.responsableForm.get('fechaAlta');
  // } 
  // get fechaBaja() {
  //   return this.responsableForm.get('fechaBaja');
  // }
  // get (){
  //   return this.responsableForm.get('');
  // }
}
