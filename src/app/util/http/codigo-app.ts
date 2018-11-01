export class CodigoApp {
    /**
     * Codigo retornado cuando se realiza una peticion mediante http y todo fue Bien.
     * 
     * Ejemplo: Se solicitan datos y estos se obtienen correctamente
     */
    public static readonly OK = 200;

    /**
     * Codigo retornado cuando los datos enviados no son validos.
     * 
     * Generalmete se retorna en peticiones de salvar datos.
     */
    public static readonly ERROR_VALIDACION = 400;

    /**
     * Codigo retornado cuando ocurrio un error inesperado.
     */
    public static readonly ERROR_GENERAL = 500;
}
