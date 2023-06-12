import express from 'express';
import { videojuegoControlador } from './dependencias';
import { autenticacion } from '../../middlewares/autenticacion';

const videojuegoRouter = express.Router();

videojuegoRouter.get(
    '/:id',
    videojuegoControlador.execObtenerVideojuegoPorId.bind(videojuegoControlador)
);

videojuegoRouter.get(
    '/',
    videojuegoControlador.execObtenerTodosVideojuegos.bind(
        videojuegoControlador
    )
);

videojuegoRouter.post(
    '/',
    autenticacion,
    videojuegoControlador.execCrearVideojuego.bind(videojuegoControlador)
);

videojuegoRouter.put(
    '/:id',
    autenticacion,
    videojuegoControlador.execActualizarVideojuego.bind(videojuegoControlador)
);

videojuegoRouter.delete(
    '/:id',
    autenticacion,
    videojuegoControlador.execEliminarVideojuego.bind(videojuegoControlador)
);

export { videojuegoRouter };
