import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable } from 'rxjs';
import { Urls } from '../../util/http/urls';
import { map, catchError } from 'rxjs/operators';
import { ItemData } from '../util/item-data';
import { Errorr } from '../util/errorr';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { HttpClient } from '@angular/common/http';
// import { HandleErrorp, HttpErrorHandlerp } from '../error/httpp-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('CategoriaService');
  }

  public salvar(categoria: Categoria): Observable<ItemData<Categoria | Errorr>> {
    let url = Urls.crearUrl(Urls.CATEGORIA);
    return this.http
      .post<ItemData<Categoria | Errorr>>(url, categoria)
      .pipe(
        catchError(this.handleError('salvar'))
      );

    // return this.api
    //   .post<ItemData<Categoria | Errorr>>(Urls.CATEGORIA, categoria)
    //   .pipe(
    //     catchError(this.handleError('salvar'))
    //   );
  }
  // public salvar(categoria: Categoria): Observable<ItemData<Categoria | Errorr | {}>> {
  //   return this.api
  //     .post<ItemData<Categoria | Errorr>>(Urls.CATEGORIA, categoria)
  //     .pipe(
  //       catchError(this.handleError('salvar', {codigo: 500, data: {}}))
  //     );
  // }
}