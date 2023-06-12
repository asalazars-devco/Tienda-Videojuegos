import express from 'express';
import { ordenControlador } from './dependencias';
import { autenticacion } from '../../middlewares/autenticacion';

const ordenRouter = express.Router();

ordenRouter.get(
    '/',
    autenticacion,
    ordenControlador.execObtenerTodasOrdenes.bind(ordenControlador)
);

ordenRouter.get(
    '/:id',
    autenticacion,
    ordenControlador.execObtenerOrdenPorId.bind(ordenControlador)
);

ordenRouter.post('/', ordenControlador.execCrearOrden.bind(ordenControlador));

ordenRouter.delete(
    '/:id',
    autenticacion,
    ordenControlador.execEliminarOrden.bind(ordenControlador)
);

export { ordenRouter };
