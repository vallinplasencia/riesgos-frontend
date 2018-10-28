export class Urls {
     /******URL donde se van a guardar y obtener los datos de la app.****/
     /**
      * URL donde se van a guardar y obtener los datos de la app.
      * 
      */
     public static readonly URL_APP = 'http://localhost:4201';
    
     /** 
      * URL donde se podran guardar los LOG (errores) de la app.
      * Si se va a utilizar una URL diferente a la de la app hay q crear un 
      * servcio q gestione los LOG y que NO DEPENDA de ApiService. Pues no se 
      * puede cambia la URL de ApiService debido a la Inyecc Dependenc obliga a que
      * haya una unica instancia de ApiService y si cambias la url en este servicio
      * cambiaria para toda la App. 
      */
     public static readonly URL_LOG_APP = Urls.URL_APP;


     /******************** URL PATH DE LA APP******************/
     public static readonly CATEGORIA = 'categoria';
}
