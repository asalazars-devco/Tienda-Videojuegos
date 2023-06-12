import { Request, Response } from 'express';

import { ObtenerVideojuegoPorId } from '../aplicacion/obtenerVideojuegoPorId';
import { ObtenerTodosVideojuegos } from '../aplicacion/obtenerTodosVideojuegos';
import { CrearVideojuego } from '../aplicacion/crearVideojuego';
import { ActualizarVideojuego } from '../aplicacion/actualizarVideojuego';
import { EliminarVideojuego } from '../aplicacion/eliminarVideojuego';

import esAdmin from '../../helpers/esAdmin';

export class VideojuegoControlador {
    constructor(
        private readonly obtenerVideojuegoPorId: ObtenerVideojuegoPorId,
        private readonly obtenerTodosVideojuegos: ObtenerTodosVideojuegos,
        private readonly crearVideojuego: CrearVideojuego,
        private readonly actualizarVideojuego: ActualizarVideojuego,
        private readonly eliminarVideojuego: EliminarVideojuego
    ) {}

    async execObtenerVideojuegoPorId(
        req: Request,
        res: Response
    ): Promise<void> {
        const idVideojuego = req.params.id;

        try {
            const videojuego = await this.obtenerVideojuegoPorId.ejecutar(
                Number(idVideojuego)
            );
            res.status(200).send(videojuego);
        } catch (error: any) {
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }

    async execObtenerTodosVideojuegos(req: Request, res: Response) {
        try {
            const videojuegosTodos =
                await this.obtenerTodosVideojuegos.ejecutar();
            res.status(200).send(videojuegosTodos);
        } catch (error) {
            res.status(500).send({
                error: 'Error al cargar los videojuegos',
            });
        }
    }

    async execCrearVideojuego(req: Request, res: Response) {
        const { nombre, precio, imagen, stock } = req.body;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const videojuegoNuevo = await this.crearVideojuego.ejecutar(
                null,
                nombre,
                precio,
                imagen,
                stock
            );

            res.status(201).send(videojuegoNuevo);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            if (error.message.includes('llave duplicada')) {
                res.status(201).sendStatus(201);
            } else {
                res.status(400).send({ error: error.message });
            }
        }
    }

    async execActualizarVideojuego(req: Request, res: Response) {
        const idVideojuego = req.params.id;
        const { nombre, precio, imagen, stock } = req.body;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const videojuegoActualizado =
                await this.actualizarVideojuego.ejecutar(
                    Number(idVideojuego),
                    nombre,
                    precio,
                    imagen,
                    stock
                );

            res.status(201).send(videojuegoActualizado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(400).send({ error: error.message });
            }
        }
    }

    async execEliminarVideojuego(req: Request, res: Response) {
        const idVideojuego = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const videojuegoEliminado = await this.eliminarVideojuego.ejecutar(
                Number(idVideojuego)
            );
            res.status(200).send(videojuegoEliminado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }
}
