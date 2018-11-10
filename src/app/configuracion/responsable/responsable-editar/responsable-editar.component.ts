import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Responsable } from '../../../acceso-datos/models/responsable';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { ResponsableService } from '../../../acceso-datos/repos/responsable.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';



// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;
const moment = _moment;

@Component({
  selector: 'app-responsable-editar',
  templateUrl: './responsable-editar.component.html',
  styleUrls: ['./responsable-editar.component.css'],
  
})
export class ResponsableEditarComponent implements OnInit {

  responsableUpd: Responsable;

  responsableForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    funcion : ['', [Validators.required, Validators.maxLength(70)]],
    area: ['', [Validators.required, Validators.maxLength(70)]],
    direccion: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
    //disabled se hace para desactivar el input q te obliga a seleccionar una fecha desde el dialog
    //Esto lo recomienda angular hacerlo de esta forma.
    fechaAlta: [{value: '', disabled: true}, [Validators.required]],
    fechaBaja: [{value: '', disabled: true}]
  });

  enviando: boolean = false;
  //Errores de validacion
  errores: Errorr = null;
  //Posibilita q si se esta mostrando un snackBar de error se oculte y si es otro snackbar se muestre hasta q se cumpla el tiempo.
  ocurrioError: boolean = false;
  subscripSalvar: Subscription = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private responsableRepo: ResponsableService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() {

    this.route.data
      .subscribe((data: { itemData: ItemData<Responsable | Errorr> }) => {
        //Obtengo los datos del resolver
        switch (data.itemData.codigo) {
          
          case CodigoApp.OK: {
            
            this.ocurrioError = false;
            this.responsableUpd = data.itemData.data as Responsable;
            
            this.responsableForm.setValue({
              nombre: this.responsableUpd.nombre,
              funcion: this.responsableUpd.funcion,
              area: this.responsableUpd.area,
              direccion: this.responsableUpd.direccion,
              email: this.responsableUpd.email,
              fechaAlta: moment(this.responsableUpd.fechaAlta),
              fechaBaja: moment(this.responsableUpd.fechaBaja),
            });
            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;
            this.responsableUpd = null;
            let err = data.itemData.data as Errorr;
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
            //Nunca debe de entrar aqui. Puse default por sueguir las normas. 
            this.ocurrioError = true;
            this.responsableUpd = null;
            let msj = 'Código de error-app: Desconocido.';
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

  onSubmit(formDirective: FormGroupDirective) {

    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();
    
    let dataSalvar = this.responsableForm.value;
    dataSalvar.fechaAlta = this.fechaAlta.value.format('YYYY-MM-DD');
    
    if(this.fechaBaja.value.isValid()){
      dataSalvar.fechaBaja = this.fechaBaja.value.format('YYYY-MM-DD');
    }
    this.subscripSalvar = this.responsableRepo
      .salvar(dataSalvar, this.responsableUpd.id)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let resp = data.data as Responsable;
            this.responsableUpd = resp;
            this.ocurrioError = false;
            this.errores = null;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ['Se guardaron correctamente los cambios de la responsable:', resp.nombre],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            // formDirective.resetForm();
            // this.responsableForm.reset();
            this.router.navigate(['/configuracion/responsable'])
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
            this.ocurrioError = true;
            let err = data.data as Errorr;
            let msj = `Código de error de la app: Desconocido. Mensaje. ${err._[0]}`;
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


  /**
   * Retorna el mensaje de error asociado al campo q no cumpla
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
      case 'fechaAlta': {
        if (this.fechaAlta.hasError('required')) {
          return 'Proporcione un valor para la fecha de alta.';
        }
        break;
      }
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
    if (this.responsableUpd && this.responsableUpd.nombre != this.nombre.value) {
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
   * Retorna True si los datos del formulario cambiaron y son validos.
   */
  activarBotonSubmit(): boolean {
    return !(
      this.responsableForm.valid && (
        this.responsableUpd.nombre != this.nombre.value ||
        this.responsableUpd.funcion != this.funcion.value ||
        this.responsableUpd.area != this.area.value ||
        this.responsableUpd.direccion != this.direccion.value ||
        this.responsableUpd.email != this.email.value ||
        this.responsableUpd.fechaAlta != this.fechaAlta.value.format('YYYY-MM-DD') ||
        this.fechaBaja.value.isValid() ? (this.responsableUpd.fechaBaja !=  (this.fechaBaja.value.format('YYYY-MM-DD'))) : false
      ))
    // return !this.responsableUpd.responsable == this.responsableForm.value
  }

  setFechaBajaPorEvent(event: MatDatepickerInputEvent<Date>) {    
    let fb = this.fechaBaja.value;

    if(fb){
      let fa_m = moment(event.value);
      let fb_m = moment(fb);

      if(fa_m > fb_m){
        this.fechaBaja.setValue('');
      }
    }
  }

  /**
   * Retorna una instancia de moment con la fecha de alta. 
   */
  get fechaAltaMoment(){
    return moment(this.fechaAlta.value);
  }

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
  get fechaAlta() {
    return this.responsableForm.get('fechaAlta');
  } 
  get fechaBaja() {
    return this.responsableForm.get('fechaBaja');
  } 

}
