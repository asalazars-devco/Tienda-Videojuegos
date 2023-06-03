import express from 'express';
import { videojuegoControlador } from './dependencias';

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
    videojuegoControlador.execCrearVideojuego.bind(videojuegoControlador)
);

videojuegoRouter.put(
    '/:id',
    videojuegoControlador.execActualizarVideojuego.bind(videojuegoControlador)
);

videojuegoRouter.delete(
    '/:id',
    videojuegoControlador.execEliminarVideojuego.bind(videojuegoControlador)
);

export { videojuegoRouter };
