import { Request, Response } from 'express';

import { ObtenerTodasOrdenes } from '../aplicacion/obtenerTodasOrdenes';
import { ObtenerOrdenPorId } from '../aplicacion/obtenerOrdenPorId';
import { CrearOrden } from '../aplicacion/crearOrden';
import { EliminarOrden } from '../aplicacion/eliminarOrden';

import esAdmin from '../../helpers/esAdmin';

export class OrdenControlador {
    constructor(
        private readonly obtenerTodasOrdenes: ObtenerTodasOrdenes,
        private readonly obtenerOrdenPorId: ObtenerOrdenPorId,
        private readonly crearOrden: CrearOrden,
        private readonly eliminarOrden: EliminarOrden
    ) {}

    execObtenerTodasOrdenes(req: Request, res: Response) {
        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.obtenerTodasOrdenes
            .ejecutar()
            .then((ordenesTodas) => res.status(200).send(ordenesTodas))
            .catch(() => {
                res.status(500).send({
                    error: 'Error al cargar las ordenes',
                });
            });
    }

    execObtenerOrdenPorId(req: Request, res: Response) {
        const idOrden = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.obtenerOrdenPorId
            .ejecutar(Number(idOrden))
            .then((orden) => res.status(200).send(orden))
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }

    async execCrearOrden(req: Request, res: Response) {
        const { videojuegos_comprados } = req.body;

        const id_usuario = req.usuario?.id;

        this.crearOrden
            .ejecutar(videojuegos_comprados, id_usuario || null)
            .then((ordenNueva) => {
                // res.set('Content-Type', 'text/plain');
                res.status(201).send(ordenNueva);
            })
            .catch((error) => {
                if (error.message.includes('no encontrado')) {
                    res.status(404).send({ error: error.message });
                } else {
                    res.status(400).send({ error: error.message });
                }
            });
    }

    async execEliminarOrden(req: Request, res: Response) {
        const idOrden = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.eliminarOrden
            .ejecutar(Number(idOrden))
            .then((ordenEliminada) => res.status(200).send(ordenEliminada))
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }
}
