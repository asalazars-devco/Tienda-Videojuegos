import { ObtenerVideojuegoPorId } from '../aplicacion/obtenerVideojuegoPorId';
import { ObtenerTodosVideojuegos } from '../aplicacion/obtenerTodosVideojuegos';
import { CrearVideojuego } from '../aplicacion/crearVideojuego';
import { ActualizarVideojuego } from '../aplicacion/actualizarVideojuego';
import { EliminarVideojuego } from '../aplicacion/eliminarVideojuego';

import { MockVideojuegosRepository } from './mockVideojuegosRepository';
import { VideojuegoControlador } from './videojuegoControlador';

const mockVideojuegosRepository = new MockVideojuegosRepository();

export const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
    mockVideojuegosRepository
);

export const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
    mockVideojuegosRepository
);

export const crearVideojuego = new CrearVideojuego(mockVideojuegosRepository);

export const actualizarVideojuego = new ActualizarVideojuego(
    mockVideojuegosRepository
);

export const eliminarVideojuego = new EliminarVideojuego(
    mockVideojuegosRepository
);

export const videojuegoControlador = new VideojuegoControlador(
    obtenerVideojuegoPorId,
    obtenerTodosVideojuegos,
    crearVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
);
