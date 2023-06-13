import { Request, Response } from 'express';

import { ObtenerTodasOrdenes } from '../aplicacion/obtenerTodasOrdenes';
import { ObtenerOrdenPorId } from '../aplicacion/obtenerOrdenPorId';
import { CrearOrden } from '../aplicacion/crearOrden';
import { EliminarOrden } from '../aplicacion/eliminarOrden';

import esAdmin from '../../helpers/esAdmin';
import verificarToken from '../../helpers/verificarToken';

export class OrdenControlador {
    constructor(
        private readonly obtenerTodasOrdenes: ObtenerTodasOrdenes,
        private readonly obtenerOrdenPorId: ObtenerOrdenPorId,
        private readonly crearOrden: CrearOrden,
        private readonly eliminarOrden: EliminarOrden
    ) {}

    async execObtenerTodasOrdenes(req: Request, res: Response) {
        try {
            const usuarioEsAdmin = esAdmin(req.usuario?.rol);

            if (!usuarioEsAdmin) {
                return res.status(403).send({ error: 'Acceso no permitido' });
            }

            const ordenesTodas = await this.obtenerTodasOrdenes.ejecutar();

            res.status(200).send(ordenesTodas);
        } catch (error) {
            res.status(500).send({
                error: 'Error al cargar las ordenes',
            });
        }
    }

    async execObtenerOrdenPorId(req: Request, res: Response) {
        const idOrden = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const orden = await this.obtenerOrdenPorId.ejecutar(
                Number(idOrden)
            );
            res.status(200).send(orden);
        } catch (error: any) {
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }

    async execCrearOrden(req: Request, res: Response) {
        const { videojuegos_comprados } = req.body;

        const id_usuario = req.usuario?.id;

        try {
            const ordenNueva = await this.crearOrden.ejecutar(
                videojuegos_comprados,
                id_usuario || null
            );

            res.set('Content-Type', 'text/plain');
            res.status(201).send(ordenNueva);
        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                res.status(404).send({ error: error.message });
            } else {
                res.status(400).send({ error: error.message });
            }
        }
    }

    async execEliminarOrden(req: Request, res: Response) {
        const idOrden = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const ordenEliminada = await this.eliminarOrden.ejecutar(
                Number(idOrden)
            );
            res.status(200).send(ordenEliminada);
        } catch (error: any) {
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }
}
