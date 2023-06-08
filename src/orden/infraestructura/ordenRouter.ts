import express from 'express';
import { ordenControlador } from './dependencias';

const ordenRouter = express.Router();

ordenRouter.get(
    '/',
    ordenControlador.execObtenerTodasOrdenes.bind(ordenControlador)
);

ordenRouter.get(
    '/:id',
    ordenControlador.execObtenerOrdenPorId.bind(ordenControlador)
);

ordenRouter.post('/', ordenControlador.execCrearOrden.bind(ordenControlador));

ordenRouter.delete(
    '/:id',
    ordenControlador.execEliminarOrden.bind(ordenControlador)
);

export { ordenRouter };
