import { Videojuego } from './videojuego';

export interface VideojuegoRepository {
    obtenerPorId(idVideojuego: number): Promise<Videojuego | null>;

    obtenerTodo(): Promise<Videojuego[] | []>;

    crear(
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego>;

    actualizar(
        idVideojuego: number,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego>;

    eliminar(idVideojuego: number): Promise<Videojuego>;
}
