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

    execObtenerVideojuegoPorId(req: Request, res: Response) {
        const idVideojuego = req.params.id;

        this.obtenerVideojuegoPorId
            .ejecutar(Number(idVideojuego))
            .then((videojuego) => res.status(200).send(videojuego))
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }

    execObtenerTodosVideojuegos(req: Request, res: Response) {
        this.obtenerTodosVideojuegos
            .ejecutar()
            .then((videojuegosTodos) => res.status(200).send(videojuegosTodos))
            .catch(() =>
                res.status(500).send({
                    error: 'Error al cargar los videojuegos',
                })
            );
    }

    execCrearVideojuego(req: Request, res: Response) {
        const { nombre, precio, imagen, stock } = req.body;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.crearVideojuego
            .ejecutar(null, nombre, precio, imagen, stock)
            .then((videojuegoNuevo) => res.status(201).send(videojuegoNuevo))
            .catch((error) => {
                if (error.message.includes('llave duplicada')) {
                    res.status(201).sendStatus(201);
                } else {
                    res.status(400).send({ error: error.message });
                }
            });
    }

    execActualizarVideojuego(req: Request, res: Response) {
        const idVideojuego = req.params.id;
        const { nombre, precio, imagen, stock } = req.body;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.actualizarVideojuego
            .ejecutar(Number(idVideojuego), nombre, precio, imagen, stock)
            .then((videojuegoActualizado) => {
                res.set('Content-Type', 'text/plain');
                res.status(201).send(videojuegoActualizado);
            })
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(400).send({ error: error.message });
                }
            });
    }

    execEliminarVideojuego(req: Request, res: Response) {
        const idVideojuego = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.eliminarVideojuego
            .ejecutar(Number(idVideojuego))
            .then((videojuegoEliminado) =>
                res.status(200).send(videojuegoEliminado)
            )
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }
}
