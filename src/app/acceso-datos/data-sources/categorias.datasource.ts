import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Categoria } from "../models/categoria";
import { CategoriaService } from "../repos/categoria.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { finalize } from "rxjs/operators";
import { Errorr } from "../util/entidades/errorr";
import { CodigoApp } from "../util/codigo-app";
import { ItemData } from "../util/entidades/item-data";
import { PaginadorInfo } from "../util/entidades/paginador-info";


export class CategoriaDataSource implements DataSource<Categoria>{

    private categoriasSubject = new BehaviorSubject<Categoria[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    private errorSubject: BehaviorSubject<ItemData<Errorr>> = new BehaviorSubject<ItemData<Errorr>>({ data: {}, codigo: 200 });
    private paginadorInfoSubject: BehaviorSubject<PaginadorInfo> = new BehaviorSubject<PaginadorInfo>({});

    public loading$ = this.loadingSubject.asObservable();

    /**
     * Va a emitir TRUE cuando ocurra un error.
     */
    public error$ = this.errorSubject.asObservable();
    public paginadorInfo$ = this.paginadorInfoSubject.asObservable();


    /**
     * 
     * @param categoriaRepo Servico para recuperar los datos
     */
    constructor(
        private categoriaRepo: CategoriaService
    ) { }

    /**
     * Carga los datos proveniente de la fuente y refresca la tabla.
     * @param pagina Numero de la pagina.
     * @param limite Cantidad de items a retornar
     * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
     * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
     * @param filtro Campo q va a filtrar los resultados     
     */
    cargarCategorias(pageIndex: number, pageSize: number, ordenarPor?: string, orden?: ''|'asc' | 'desc', filtro?: string) {

        this.loadingSubject.next(true);
        this.categoriaRepo
            .index(pageIndex, pageSize, ordenarPor, orden, filtro)
            .pipe(
                finalize(() => this.loadingSubject.next(false))
            ).subscribe(data => {
                switch (data.codigo) {
                    case CodigoApp.OK: {
                        this.categoriasSubject.next(data.data as Categoria[]);
                        this.paginadorInfoSubject.next({ links: data.links, meta: data.meta });
                        break;
                    }
                    case CodigoApp.ERROR_VALIDACION: {
                        //No debe ir la validacions del filtrar se realiza en el template y no voy a poner la del servidor
                        //   this.errores = data.data as Errorr
                        this.categoriasSubject.next([]);
                        this.paginadorInfoSubject.next({});
                        break;
                    }
                    case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
                        this.categoriasSubject.next([]);
                        this.errorSubject.next(data as ItemData<Errorr>);
                        this.paginadorInfoSubject.next({});
                        break;
                    }
                    default: {
                        //Nunca debe de entrar aqui. Puse default por seguir las normas.
                        this.categoriasSubject.next([]);
                        this.errorSubject.next({ codigo: 500, data: { _: ['Ocurrió un problema. Inténtelo mas tarde.'] } });
                        this.paginadorInfoSubject.next({});
                        break;
                    }
                }
            });
    }

    // cargarCategorias(pageIndex: number, pageSize: number, ordenarPor?: string, orden?: ''|'asc' | 'desc', filtro?: string) {

    //     this.loadingSubject.next(true);
    //     this.categoriaRepo
    //         .index(pageIndex, pageSize, ordenarPor, orden, filtro)
    //         .pipe(
    //             finalize(() => this.loadingSubject.next(false))
    //         ).subscribe(data => {
    //             switch (data.codigo) {
    //                 case CodigoApp.OK: {
    //                     this.categoriasSubject.next(data.data as Categoria[]);
    //                     this.paginadorInfoSubject.next({ links: data.links, meta: data.meta });
    //                     break;
    //                 }
    //                 case CodigoApp.ERROR_VALIDACION: {
    //                     //No debe ir la validacions del filtrar se realiza en el template y no voy a poner la del servidor
    //                     //   this.errores = data.data as Errorr
    //                     this.categoriasSubject.next([]);
    //                     this.paginadorInfoSubject.next({});
    //                     break;
    //                 }
    //                 case CodigoApp.ERROR_GENERAL: {//Ocurrio un error. Ver Servicio de este Modelo, throwError.
    //                     this.categoriasSubject.next([]);
    //                     this.errorSubject.next(data as ItemData<Errorr>);
    //                     this.paginadorInfoSubject.next({});
    //                     break;
    //                 }
    //                 default: {
    //                     //Nunca debe de entrar aqui. Puse default por seguir las normas.
    //                     this.categoriasSubject.next([]);
    //                     this.errorSubject.next({ codigo: 500, data: { _: ['Ocurrió un problema. Inténtelo mas tarde.'] } });
    //                     this.paginadorInfoSubject.next({});
    //                     break;
    //                 }
    //             }
    //         });
    // }

    connect(collectionViewer: CollectionViewer): Observable<Categoria[]> {
        console.log("Connecting data source");
        return this.categoriasSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.categoriasSubject.complete();
        this.loadingSubject.complete();
    }
}
