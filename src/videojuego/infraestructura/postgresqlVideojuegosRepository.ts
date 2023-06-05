import { Videojuego } from '../dominio/videojuego';
import { VideojuegoRepository } from '../dominio/videojuegoRepository';

import Database from '../../postgreSQL_DB';

const database = Database.getInstance();

export class PostgresqlVideojuegosRepository implements VideojuegoRepository {
    async obtenerPorId(idVideojuego: string): Promise<Videojuego | null> {
        const query = 'SELECT * FROM videojuegos WHERE id = $1';
        const values = [idVideojuego];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            return null;
        } else {
            const videojuego = resultado[0];
            return new Videojuego(
                String(videojuego.id),
                videojuego.nombre,
                Number(videojuego.precio),
                videojuego.imagen,
                videojuego.stock
            );
        }
    }

    async obtenerTodo(): Promise<[] | Videojuego[]> {
        const query = 'SELECT * FROM videojuegos';
        const videojuegos = await database.query(query);

        return videojuegos.map(
            (videojuego: {
                id: any;
                nombre: string;
                precio: any;
                imagen: string;
                stock: number;
            }) => {
                return new Videojuego(
                    String(videojuego.id),
                    videojuego.nombre,
                    Number(videojuego.precio),
                    videojuego.imagen,
                    videojuego.stock
                );
            }
        );
    }

    async crear(
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego> {
        const query =
            'INSERT INTO videojuegos (nombre, precio, imagen, stock) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego,
        ];

        try {
            const resultado = await database.query(query, values);
            const videojuego = resultado[0];

            return new Videojuego(
                String(videojuego.id),
                videojuego.nombre,
                Number(videojuego.precio),
                videojuego.imagen,
                videojuego.stock
            );
        } catch (error: any) {
            if (error.message.includes('llave duplicada')) {
                const query = 'SELECT * FROM videojuegos WHERE nombre = $1';
                const values = [nombreVideojuego];

                const resultado = await database.query(query, values);
                const videojuego = resultado[0];
                return new Videojuego(
                    String(videojuego.id),
                    videojuego.nombre,
                    Number(videojuego.precio),
                    videojuego.imagen,
                    videojuego.stock
                );
            }

            const query =
                'DELETE FROM videojuegos WHERE nombre = $1 RETURNING *';
            const values = [nombreVideojuego];

            await database.query(query, values);
            throw new Error(error.message);
        }
    }

    async actualizar(
        idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego> {
        const query =
            'UPDATE videojuegos SET nombre = $1, precio = $2, imagen = $3, stock = $4 WHERE id = $5 RETURNING *';
        const values = [
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego,
            idVideojuego,
        ];

        try {
            const videojuegoActualizado = new Videojuego(
                String(idVideojuego),
                nombreVideojuego,
                Number(precioVideojuego),
                imagenVideojuego,
                stockVideojuego
            );

            const resultado = await database.query(query, values);

            if (resultado.length === 0) {
                console.log(
                    `ID ${idVideojuego} no encontrado en la base de datos`
                );
                console.log('Se crea el videojuego');
                return this.crear(
                    nombreVideojuego,
                    precioVideojuego,
                    imagenVideojuego,
                    stockVideojuego
                );
            } else {
                return videojuegoActualizado;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async eliminar(idVideojuego: string): Promise<Videojuego> {
        const query = 'DELETE FROM videojuegos WHERE id = $1 RETURNING *';
        const values = [idVideojuego];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            throw new Error(
                `ID ${idVideojuego} no encontrado en la base de datos`
            );
        } else {
            const videojuego = resultado[0];
            return new Videojuego(
                String(videojuego.id),
                videojuego.nombre,
                Number(videojuego.precio),
                videojuego.imagen,
                videojuego.stock
            );
        }
    }
}
