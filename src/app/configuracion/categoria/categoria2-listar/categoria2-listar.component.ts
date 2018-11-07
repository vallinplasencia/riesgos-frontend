import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CategoriaDataSource } from '../../../acceso-datos/data-sources/categorias.datasource';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { of, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { Valores } from '../../../util/valores';

@Component({
  selector: 'app-categoria2-listar',
  templateUrl: './categoria2-listar.component.html',
  styleUrls: ['./categoria2-listar.component.css']
})
export class Categoria2ListarComponent implements OnInit, AfterViewInit {

  dataSource: CategoriaDataSource;

  columnas = ["numero", "categoria", "acciones"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;


  error: boolean = false;
  opcsPageSize: number[];
  totalItems: number;

  constructor(
    private coursesService: CategoriaService,
    private snackBar: MatSnackBar
  ) {
    this.opcsPageSize = Valores.OPCS_PAG_SIZE;
    this.totalItems = 0;
  }

  ngOnInit() {
    this.dataSource = new CategoriaDataSource(this.coursesService);
    this.dataSource.cargarCategorias(
      this.paginator.pageIndex, 
      Valores.OPCS_PAG_SIZE[0],
      this.sort.active,
      this.sort.direction);

  }


  ngAfterViewInit() {
    
    

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.cargarCategorias();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.cargarCategorias())
      )
      .subscribe();



    this.dataSource
      .error$
      .subscribe(data => {
        switch (data.codigo) {
          case CodigoApp.OK: {
            this.error = false;
            //No hacer nada. Todo Bien. Es por dedecto el primer valor q emite este observable. Ver Clase DataSource q le corresponde
            break;
          }
          case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
            this.error = true;
            let err = data.data as Errorr;
            let msj = `${err._[0]}. Codigo de error-app: ${CodigoApp.ERROR_GENERAL}. `;
            this.snackBar.openFromComponent(SnackbarErrorComponent, {
              data: msj,
              duration: Util.SNACKBAR_DURACION_ERROR,
            });
            break;
          }
          default: {
            //Nunca debe de entrar aqui. Puse default por suiguir las normas.
            this.error = true;
            let msj = 'Ocurrio un problema. Intentelo mas tarde. Codigo de error-app: Desconocido.';
            this.snackBar.openFromComponent(SnackbarErrorComponent, {
              data: msj,
              duration: Util.SNACKBAR_DURACION_ERROR,
            });
            break;
          }
        }
      }
      );

    this.dataSource.loading$.subscribe(
      data => {
        if (data) {
          this.error = false;
          this.snackBar.dismiss();
        }
      }
    );

    this.dataSource
      .paginadorInfo$
      .subscribe((paginadorInfo) => {
        if (!Util.isObjVacio(paginadorInfo)) {
          this.totalItems = paginadorInfo.meta.total;
        } else {
          this.totalItems = 0;
        }
      });

  }

  cargarCategorias() {
    this.dataSource.cargarCategorias(
      this.paginator.pageIndex, 
      this.paginator.pageSize, 
      this.sort.active, 
      this.sort.direction,
      this.input.nativeElement.value
    )
      // (
      // this.input.nativeElement.value,
      // this.sort.direction,
      // this.paginator.pageIndex,
      // this.paginator.pageSize);
  }


}
