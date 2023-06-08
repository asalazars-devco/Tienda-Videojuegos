import { Orden } from '../dominio/orden';
import { OrdenRepository } from '../dominio/ordenRepository';
import { VideojuegoRepository } from '../../videojuego/dominio/videojuegoRepository';

import Database from '../../postgreSQL_DB';

const database = Database.getInstance();

export class PostgresqlOrdenRepository implements OrdenRepository {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async obtenerTodo(): Promise<[] | Orden[]> {
        const query = 'SELECT * FROM ordenes';
        const ordenes = await database.query(query);

        return ordenes.map(
            (orden: {
                id: number;
                videojuegos_comprados: Array<{
                    id: number;
                    cantidad: number;
                }>;
                cantidad: number;
                valor_total: number;
            }) => {
                const ordenObtenida = new Orden(orden.videojuegos_comprados);
                ordenObtenida.colocarValorTotal(orden.valor_total);
                ordenObtenida.colocarId(orden.id);
                return ordenObtenida;
            }
        );
    }

    async obtenerPorId(idOrden: number): Promise<Orden> {
        const query = 'SELECT * FROM ordenes WHERE id = $1';
        const values = [idOrden];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            throw new Error(`No existe una orden con ID ${idOrden}`);
        } else {
            const orden = resultado[0];
            const ordenObtenida = new Orden(orden.videojuegos_comprados);
            ordenObtenida.colocarValorTotal(orden.valor_total);
            ordenObtenida.colocarId(orden.id);
            return ordenObtenida;
        }
    }

    async crear(
        videojuegos_compradosOrden: Array<{
            id: number;
            cantidad: number;
        }>
    ): Promise<Orden> {
        try {
            const ordenCreada = new Orden(videojuegos_compradosOrden);
            let valorTotalOrden = 0;

            // Verifico si los juegos existen y si tienen stock disponible
            await Promise.all(
                videojuegos_compradosOrden.map(async (videojuego) => {
                    const videojuegoComprado =
                        await this.videojuegoRepository.obtenerPorId(
                            videojuego.id
                        );

                    if (!videojuegoComprado) {
                        throw new Error(
                            `Videojuego con ID ${videojuego.id} no encontrado`
                        );
                    }

                    if (!videojuego.cantidad) {
                        throw new Error(
                            'La cantidad a comprar del videojuego no esta especificada'
                        );
                    }

                    if (videojuegoComprado.stock < videojuego.cantidad) {
                        throw new Error(
                            'No hay suficiente stock disponible del videojuego'
                        );
                    }

                    valorTotalOrden +=
                        videojuegoComprado.precio * videojuego.cantidad;
                })
            );

            // Creo la orden de compra en la base de datos
            const crearOrdenQuery =
                'INSERT INTO ordenes (videojuegos_comprados, cantidad, valor_total) VALUES ($1, $2, $3) RETURNING *';
            const crearOrdenValues = [
                JSON.stringify(videojuegos_compradosOrden),
                ordenCreada.obtenerCantidad(),
                valorTotalOrden,
            ];

            const crearOrdenResultado = await database.query(
                crearOrdenQuery,
                crearOrdenValues
            );

            const orden = crearOrdenResultado[0];
            ordenCreada.colocarValorTotal(orden.valor_total);
            ordenCreada.colocarId(orden.id);

            // Actualizo los juegos con el nuevo stock en la base de datos
            await Promise.all(
                videojuegos_compradosOrden.map(async (videojuego) => {
                    const videojuegoComprado =
                        await this.videojuegoRepository.obtenerPorId(
                            videojuego.id
                        );

                    if (!videojuegoComprado) {
                        throw new Error(
                            `Videojuego con ID ${videojuego.id} no encontrado`
                        );
                    }
                    const stockActualizado =
                        videojuegoComprado.stock - videojuego.cantidad;

                    await this.videojuegoRepository.actualizar(
                        videojuegoComprado.id,
                        videojuegoComprado.nombre,
                        videojuegoComprado.precio,
                        videojuegoComprado.imagen,
                        stockActualizado
                    );
                })
            );

            return ordenCreada;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async eliminar(idOrden: number): Promise<Orden> {
        const query = 'DELETE FROM ordenes WHERE id = $1 RETURNING *';
        const values = [idOrden];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            throw new Error(`Orden con ID ${idOrden} no encontrada`);
        } else {
            const orden = resultado[0];
            const ordenEliminada = new Orden(orden.videojuegos_comprados);
            ordenEliminada.colocarValorTotal(orden.valor_total);
            ordenEliminada.colocarId(orden.id);
            return ordenEliminada;
        }
    }
}
