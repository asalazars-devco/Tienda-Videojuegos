import { Orden } from './orden';

export interface OrdenRepository {
    obtenerTodo(): Promise<Orden[] | []>;

    obtenerPorId(idOrden: number): Promise<Orden>;

    crear(
        videojuegos_compradosOrden: Array<{
            id: number;
            cantidad: number;
        }>
    ): Promise<Orden>;

    eliminar(idOrden: number): Promise<Orden>;
}
