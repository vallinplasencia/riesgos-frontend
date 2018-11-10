export interface Responsable {
    id?:number;
    nombre: string;
    funcion: string;
    area: string;
    direccion: string;
    email: string;
    fechaAlta?: Date;
    fechaBaja?: Date;
}
