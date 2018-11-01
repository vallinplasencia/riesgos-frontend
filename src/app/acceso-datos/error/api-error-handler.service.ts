import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ItemData } from '../util/item-data';
import { Errorr } from '../util/errorr';
import { Util } from '../../util/util';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  (operation?: string, result?: ItemData<Errorr>) => (error: HttpErrorResponse) => Observable<ItemData<Errorr>>;
// export type HandleError =
//   <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;


@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor() { }

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') =>
    (operation = 'operation',result = {} as ItemData<Errorr>) => this.handleError(serviceName, operation, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * 
   * @returns Observable<{}|T> - Objeto a retornar.
   */
  

  handleError(serviceName = '', operation = 'operation', result = {} as ItemData<Errorr>) {

    return (error: HttpErrorResponse): Observable<ItemData<Errorr>> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // const message = (error.error instanceof ErrorEvent) ?
      //   'Error en el cliente o de red. '+error.error.message :
      //   `Error del servidor. Código: ${error.status}. Mensaje: "${error.error}"`;
      let msj:string;

      if(error.error instanceof ErrorEvent){
        msj = 'Error en el cliente o en la red. '+error.error.message ;
      }else{
        if(error.status){
          msj = `Error del servidor: Código: ${error.status}. Mensaje: "${error.message}"`;
        }else{
          msj = 'Existen problemas de conexión con el servidor.';
        }
        
      }
      if(Util.isObjVacio(result)){
        return of({codigo: 500, data:{'_': [msj]}});
      }
      // Let the app keep running by returning a safe result.

      return of(result);
    };

  }

}
export class ItemDataa<T> {
  data: T;
  codigo: number;
}



