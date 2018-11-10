import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Responsable } from '../../../acceso-datos/models/responsable';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { ResponsableService } from '../../../acceso-datos/repos/responsable.service';
import { merge, fromEvent, Observable, Subscription, Subject } from 'rxjs';
import { startWith, switchMap, map, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { Valores } from '../../../util/valores';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { SnackbarSuccessComponent } from '../../../template/snackbar/snackbar-success/snackbar-success.component';

@Component({
  selector: 'app-responsable-listar',
  templateUrl: './responsable-listar.component.html',
  styleUrls: ['./responsable-listar.component.css']
})
export class ResponsableListarComponent implements OnInit {

  //Propiedades relacionadas con la tabla
  columnas: string[] = ['numero', 'nombre', 'funcion', 'area', 'direccion', 'email', 'fechaAlta', 'fechaBaja', 'acciones'];
  data: Responsable[] = [];
  isLoadingResults = true;
  opcsPageSize: number[];
  totalItems: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;


  ocurrioError: boolean = false;
  eliminando: boolean = false;
  //Nombre q se muestra al usuario cuando se va a eliminar una fila.
  responsableAEliminar = null;

  //Hace q se cancele la peticion de recuperar los datos cuando se navega a otra url desde la url actual. 
  private subscriptionResponsables: Subscription = null;
  private subscriptionEliminar: Subscription = null;
  private subscriptionResponsablesRefresh: Subscription = null;

  //Subject q emite cuando se presione el btn refrescar
  private refrescarClick = new Subject();
  private filtarTermino = new Subject<string>();

  constructor(
    private responsableRepo: ResponsableService,
    private dialogConfigm: DialogConfirmSimpleService,
    private snackBar: MatSnackBar,
  ) {
    this.opcsPageSize = Valores.OPCS_PAG_SIZE;
    this.totalItems = 0;
  }

  public ngOnInit() { }

  public ngAfterViewInit(): void {

    // Si se cambia el orden se regresa a la primera pagina de la tabla.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subscriptionResponsables = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.ocurrioError = false;
        this.snackBar.dismiss();

        this.data = [];
        this.totalItems = 0;
        this.paginator.pageIndex = 0;
        
          return this.responsableRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => {
      this.onSubscribe(data);
    });

    this.subscriptionResponsablesRefresh = this.refrescarClick
      .pipe(
        switchMap(() => {
          this.isLoadingResults = true;
          return this.responsableRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.input.nativeElement.value);
        })
      ).subscribe((data) => {
        this.onSubscribe(data);
      });


    this.filtarTermino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isLoadingResults = true;
        this.ocurrioError = false;
        this.snackBar.dismiss();

        this.data = [];
        this.totalItems = 0;
        this.paginator.pageIndex = 0;
        return this.responsableRepo!.index(
          0,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.input.nativeElement.value);
      }),
    ).subscribe((data) => { this.onSubscribe(data) });


  }

  /**
   * Metodo q se llama cuando se presiona el boton refrescar.
   * Emite un valor vacio. Hace q se ejecute una nueva llamada a los datos desde el servidor. 
   * @param event 
   */
  refrescar(event) {
    event.preventDefault();
    this.ocurrioError = false;
    this.snackBar.dismiss();

    this.data = [];
    this.totalItems = 0;
    this.refrescarClick.next();
  }

  /**
   * Metodo q se llama cuando se presiona una tecla en el input q filtra los datos de la tabla.
   * Emite el texto q hay en el INPUT. Hace q se ejecute una nueva llamada a los datos desde el servidor. 
   * @param cadena 
   */
  filtrar(cadena: string) {
    this.filtarTermino.next(cadena);
  }

  /**
   * Metodo que se llama cada vez q hay un cambio en los datos a mostrar en la tabla.
   * Llenando la fuente de datos de la tabla y manejando posibles errores q puedan ocurrir
   * @param data 
   */
  private onSubscribe(data: ItemData<Responsable[] | Errorr>) {
    this.isLoadingResults = false;

    switch (data.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = data.meta.total;
        // this.data = data.data as Responsable[];
        let responsables = data.data as Responsable[];

        if (!responsables.length && this.totalItems) {
          //Si en la pagina actual de la tabla no tiene responsables pero hay paginas anteriores.Navego a la anterior 
          this.paginator.previousPage();
        } else {
          this.data = data.data as Responsable[];
        }
        break;
      }
      case CodigoApp.ERROR_GENERAL: {
        this.ocurrioError = true;
        this.data = [];
        this.totalItems = 0;
        this.paginator.pageIndex = 0;
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
        this.data = [];
        this.totalItems = 0;
        this.paginator.pageIndex = 0;
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
  }

  confirmarEliminacion(event, id: number | string, responsable: string) {
    event.preventDefault();
    this.dialogConfigm.confirm("Se eliminará permanentemente el responsable: " + responsable.toUpperCase() + ".\nDesea eliminarla de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.responsableAEliminar = responsable;

          this.eliminar(id);
        }
      });
  }

  private eliminar(id: number | string) {
    this.eliminando = true;

    this.subscriptionEliminar = this.responsableRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {

          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.responsableAEliminar = null;
            let resp = data.data as Responsable;
            let responsables = this.data.filter((cc) => {
              return cc.id != resp.id;
            });
            this.totalItems = this.totalItems - 1;

            if (!responsables.length && this.totalItems) {
              //Si en la pagina actual de la tabla no tiene responsables pero hay paginas anteriores.Navego a la anterior 
              this.paginator.previousPage();
            } else {
              this.data = responsables;
            }
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ["Se eliminó correctamente el responsable: ", resp.nombre.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });

            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;
            this.data = [];
            this.totalItems = 0;
            this.paginator.pageIndex = 0;
            let err = data.data as Errorr;
            let msj = `Código de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarErrorComponent, {
                data: ['Ocurrió un problema. Inténtelo mas tarde. ', msj],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });

            break;
          }
          default: {
            //Nunca debe de entrar aqui. Puse default por suiguir las normas.
            this.ocurrioError = true;
            this.data = [];
            this.totalItems = 0;
            this.paginator.pageIndex = 0;
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

  cancelarEliminacion() {
    this.eliminando = false;

    // if (this.ocurrioError) {
    this.snackBar.dismiss();
    // }
    if (this.subscriptionEliminar) {
      this.subscriptionEliminar.unsubscribe();
    }
  }


  public canDeactivate(): Observable<boolean> | boolean {
    if (this.subscriptionResponsables) {
      this.subscriptionResponsables.unsubscribe();
    }
    if (this.subscriptionResponsablesRefresh) {
      this.subscriptionResponsablesRefresh.unsubscribe();
    }
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.eliminando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está eliminando una responsable. Cancele esta operación primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }

}
