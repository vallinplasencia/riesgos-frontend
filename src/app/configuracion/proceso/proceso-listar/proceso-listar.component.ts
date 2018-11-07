import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Proceso } from '../../../acceso-datos/models/proceso';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { ProcesoService } from '../../../acceso-datos/repos/proceso.service';
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
  selector: 'app-proceso-listar',
  templateUrl: './proceso-listar.component.html',
  styleUrls: ['./proceso-listar.component.css']
})
export class ProcesoListarComponent implements OnInit , AfterViewInit {

  //Propiedades relacionadas con la tabla
  columnas: string[] = ['numero', 'proceso', 'acciones'];
  data: Proceso[] = [];
  isLoadingResults = true;
  opcsPageSize: number[];
  totalItems: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;


  ocurrioError: boolean = false;
  eliminando: boolean = false;
  //Nombre q se muestra al usuario cuando se va a eliminar una fila.
  procesoAEliminar = null;

  //Hace q se cancele la peticion de recuperar los datos cuando se navega a otra url desde la url actual. 
  private subscriptionProceso: Subscription = null;
  private subscriptionEliminar: Subscription = null;
  private subscriptionProcesosRefresh: Subscription = null;

  //Subject q emite cuando se presione el btn refrescar
  private refrescarClick = new Subject();
  private filtarTermino = new Subject<string>();

  constructor(
    private procesoRepo: ProcesoService,
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

    this.subscriptionProceso = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.procesoRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => {
      this.onSubscribe(data);
    });

    this.subscriptionProcesosRefresh = this.refrescarClick
      .pipe(
        switchMap(() => {
          this.isLoadingResults = true;
          return this.procesoRepo!.index(
            0,
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
        return this.procesoRepo!.index(
          0,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.input.nativeElement.value);
      }),
    ).subscribe((data) => { this.onSubscribe(data) });


  }

  refrescar(event) {
    event.preventDefault();
    this.ocurrioError = false;
    this.snackBar.dismiss();

    this.data = [];
    this.totalItems = 0;
    this.refrescarClick.next();
  }

  filtrar(cadena: string) {
    this.filtarTermino.next(cadena);
  }

  private onSubscribe(data: ItemData<Proceso[] | Errorr>) {
    this.isLoadingResults = false;

    switch (data.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = data.meta.total;
        this.data = data.data as Proceso[];
        break;
      }
      case CodigoApp.ERROR_GENERAL: {
        this.ocurrioError = true;
        this.data = [];
        this.totalItems = 0;

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
        this.totalItems = 0;
        this.data = [];
        this.totalItems = 0;
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

  confirmarEliminacion(event, id: number | string, proceso: string) {
    event.preventDefault();
    this.dialogConfigm.confirm("Se eliminará permanentemente la proceso: " + proceso.toUpperCase() + ".\nDesea eliminarla de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.procesoAEliminar = proceso;

          this.eliminar(id);
        }
      });
  }

  private eliminar(id: number | string) {
    this.eliminando = true;

    this.subscriptionEliminar = this.procesoRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {

          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.procesoAEliminar = null;
            let proc = data.data as Proceso;
            this.data = this.data.filter((cc) => {
              return cc.id != proc.id;
            });
            this.totalItems = this.totalItems - 1;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarSuccessComponent, {
                data: ["Se eliminó correctamente la proceso: ", proc.proceso.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });

            break;
          }
          case CodigoApp.ERROR_GENERAL: {
            this.ocurrioError = true;
            this.data = [];
            this.totalItems = 0;
            let err = data.data as Errorr;
            let msj = `Codigo de error de la app: ${CodigoApp.ERROR_GENERAL}. ${err._[0]}`;
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
    if (this.subscriptionProceso) {
      this.subscriptionProceso.unsubscribe();
    }
    if (this.subscriptionProcesosRefresh) {
      this.subscriptionProcesosRefresh.unsubscribe();
    }
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.eliminando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está eliminando una proceso. Cancele esta operación primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }
}

