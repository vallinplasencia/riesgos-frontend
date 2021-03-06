export class Urls {
     /**
      * URL donde se van a guardar y obtener los datos de la app.
      * 
      */
     public static readonly URL_APP = 'http://riesgos-backend.mii';
    
     /** 
      * URL donde se podran guardar los LOG (errores) de la app.
      * Si se va a utilizar una URL diferente a la de la app hay q crear un 
      * servcio q gestione los LOG y que NO DEPENDA de ApiService. Pues no se 
      * puede cambia la URL de ApiService debido a la Inyecc Dependenc obliga a que
      * haya una unica instancia de ApiService y si cambias la url en este servicio
      * cambiaria para toda la App. 
      */
     public static readonly URL_LOG_APP = Urls.URL_APP;

     
     public static readonly CATEGORIA = 'api/categoria';
     public static readonly PROCESO = 'api/proceso';
     public static readonly RESPONSABLE = 'api/responsable';




    ///////////////////**************PARAMETROS DE LAS URLs********************///////////////////// 
     
    public static readonly PARAM_PAGINA = "_pagina";
    public static readonly PARAM_LIMITE = "_limite";

    public static readonly PARAM_ORDENAR_POR = "_ordenar";
    public static readonly PARAM_ORDEN = "_orden";

    public static readonly PARAM_FILTRO = "_filtro";


    /**
     * Retorna la url absoluta basada en la url BASE de la APP y el path que le 
     * pases por @param urlOrPath .Si le pasas una url absoluta la retorna exactamente. 
     * La url base se define en esta clase.
     * @param url path o url absoluta.
     */
     public static crearUrl(url: string) {
        return url.startsWith('http') ? url : `${this.URL_APP}/${url}`;
      }
}
