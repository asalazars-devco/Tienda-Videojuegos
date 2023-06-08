import { Request, Response } from 'express';

import { ObtenerTodasOrdenes } from '../aplicacion/obtenerTodasOrdenes';
import { ObtenerOrdenPorId } from '../aplicacion/obtenerOrdenPorId';
import { CrearOrden } from '../aplicacion/crearOrden';
import { EliminarOrden } from '../aplicacion/eliminarOrden';

export class OrdenControlador {
    constructor(
        private readonly obtenerTodasOrdenes: ObtenerTodasOrdenes,
        private readonly obtenerOrdenPorId: ObtenerOrdenPorId,
        private readonly crearOrden: CrearOrden,
        private readonly eliminarOrden: EliminarOrden
    ) {}

    async execObtenerTodasOrdenes(req: Request, res: Response) {
        const ordenesTodas = await this.obtenerTodasOrdenes.ejecutar();

        res.status(200).send(ordenesTodas);
    }

    async execObtenerOrdenPorId(req: Request, res: Response) {
        const idOrden = req.params.id;

        try {
            const orden = await this.obtenerOrdenPorId.ejecutar(
                Number(idOrden)
            );
            res.status(200).send(orden);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(404).sendStatus(404);
        }
    }

    async execCrearOrden(req: Request, res: Response) {
        const { videojuegos_comprados } = req.body;

        try {
            const ordenNueva = await this.crearOrden.ejecutar(
                videojuegos_comprados
            );

            res.status(201).send(ordenNueva);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(400).sendStatus(400);
        }
    }

    async execEliminarOrden(req: Request, res: Response) {
        const idOrden = req.params.id;

        try {
            const ordenEliminada = await this.eliminarOrden.ejecutar(
                Number(idOrden)
            );
            res.send(ordenEliminada);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(404).sendStatus(404);
        }
    }
}
