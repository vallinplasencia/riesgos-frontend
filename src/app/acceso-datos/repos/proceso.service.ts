import { Injectable } from '@angular/core';
import { Proceso } from '../models/proceso';
import { Observable } from 'rxjs';
import { Urls } from '../util/urls';
import { map, catchError } from 'rxjs/operators';
import { ItemData } from '../util/entidades/item-data';
import { Errorr } from '../util/entidades/errorr';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { HandleErrorp, HttpErrorHandlerp } from '../error/httpp-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('ProcesoService');
  }

  /**
   * Metodo que devuelve el listado de las procesos p error a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * @param pagina Numero de la pagina.
   * @param limite Cantidad de items a retornar
   * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
   * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
   * @param filtro Campo q va a filtrar los resultados
   * @returns Observable<ItemData<Proceso[] | Errorr>> Rerona un observable q puede emitir
   * un ItemData con un arreglo de proceso si todo ocurrio normalmente o un ItemData con 
   * un Errorr si ocurrio algun problema de red o error en el server ...
   */
  public index(
    pagina: number, limite: number, campOrdenar?: string, orden?: ''|'asc'|'desc', filtro?: string
  ): Observable<ItemData<Proceso[] | Errorr>> {
    let url = Urls.crearUrl(Urls.PROCESO);

    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA, (pagina+1).toString())
      .set(Urls.PARAM_LIMITE, limite.toString());

    if (campOrdenar) {
      orden = orden || "asc";
      params = params
        .set(Urls.PARAM_ORDENAR_POR, campOrdenar)
        .set(Urls.PARAM_ORDEN, orden);
    }

    if(filtro){
      params = params.set(Urls.PARAM_FILTRO, filtro);
    }

    return this.http
      .get<ItemData<Proceso[] | Errorr>>(url, {params: params})
      .pipe(
        catchError(this.handleError('index'))
      );
  }

  public salvar(proceso: Proceso, id:number = -1): Observable<ItemData<Proceso | Errorr>> {
    let url = Urls.crearUrl(Urls.PROCESO);

    if(id == -1){
    return this.http
      .post<ItemData<Proceso | Errorr>>(url, proceso)
      .pipe(
        catchError(this.handleError('salvar_nuevo'))
      );
    }
    return this.http
      .put<ItemData<Proceso | Errorr>>(`${url}/${id}`, proceso)
      .pipe(
        catchError(this.handleError('salvar_actualizar'))
      );
  }
  

  public getProceso(id: number|string): Observable<ItemData<Proceso|Errorr>>{
    let url = Urls.crearUrl(Urls.PROCESO);
    return this.http
    .get<ItemData<Proceso|Errorr>>(`${url}/${id}`)
    .pipe(
      catchError(this.handleError('getProceso'))
    );
  }
  
  public eliminar(id:number|string){
    let url = Urls.crearUrl(Urls.PROCESO);

    return this.http
    .delete<ItemData<Proceso|Errorr>>(`${url}/${+id}`)
    .pipe(
      catchError(this.handleError('eliminar'))
    );;
  }

}