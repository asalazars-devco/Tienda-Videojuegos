import { Videojuego } from './videojuego';

export interface VideojuegoRepository {
    obtenerPorId(idVideojuego: string): Promise<Videojuego | null>;

    obtenerTodo(): Promise<Videojuego[] | []>;

    crear(
        idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego>;

    actualizar(
        idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego>;

    eliminar(idVideojuego: string): Promise<Videojuego>;
}
