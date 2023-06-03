export class Videojuego {
    constructor(
        readonly id: string,
        readonly nombre: string,
        readonly precio: number,
        readonly imagen: string,
        readonly stock: number
    ) {
        if (typeof id !== 'string' || id.length === 0) {
            throw new Error(
                'ID tiene que ser de tipo string y no puede ser vacio'
            );
        }
        if (typeof nombre !== 'string' || nombre.length === 0) {
            throw new Error(
                'Nombre tiene que ser de tipo string y no puede ser vacio'
            );
        }
        if (typeof precio !== 'number' || precio < 0) {
            throw new Error(
                'Precio tiene que ser de tipo numero y no puede ser menor a 0'
            );
        }
        if (typeof imagen !== 'string' || imagen.length === 0) {
            throw new Error(
                'Imagen tiene que ser de tipo string y no puede ser vacio'
            );
        }
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error(
                'Stock tiene que ser de tipo numero y no puede ser menor a 0'
            );
        }
    }
}
