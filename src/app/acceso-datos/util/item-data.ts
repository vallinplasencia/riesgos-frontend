/**
 * Interface que representa generalmente la estructura de los datos provenietes de una 
 * peticion http. 
 * 
 * T - Tipo que cumple con los datos concretamente. 
 * Puede ser una entidad, error de validacion o error general
 * 
 * - codigo: Codigo q tiene el error. Ver clase util/http/codigo-app.
 * - data: Datos a procesar. Datos de la entidad o error 
 * 
 * Ejemplo:
 * 
 * Datos entidad:
 * {codigo: 200, data: {nombre: 'vallin', apellido: 'plasencia'}}
 * 
 * 
 * Datos error de validacion:
 * {codigo: 400, data: {nombre: ['Nombre obligatorio', '....']}}
 * 
 * 
 * Datos error generales(red o cliente):
 * {codigo: 500, data: {_: ['Error de red', '....']}}
 */
export interface ItemData<T> {
    data: T;
    codigo: number;
}
