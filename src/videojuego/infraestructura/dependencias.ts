import { ObtenerVideojuegoPorId } from '../aplicacion/obtenerVideojuegoPorId';
import { ObtenerTodosVideojuegos } from '../aplicacion/obtenerTodosVideojuegos';
import { CrearVideojuego } from '../aplicacion/crearVideojuego';
import { ActualizarVideojuego } from '../aplicacion/actualizarVideojuego';
import { EliminarVideojuego } from '../aplicacion/eliminarVideojuego';

import { MockVideojuegosRepository } from './mockVideojuegosRepository';
import { PostgresqlVideojuegosRepository } from './postgresqlVideojuegosRepository';
import { VideojuegoControlador } from './videojuegoControlador';

const mockVideojuegosRepository = new MockVideojuegosRepository();
const postgresqlVideojuegosRepository = new PostgresqlVideojuegosRepository();

export const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
    postgresqlVideojuegosRepository
);

export const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
    postgresqlVideojuegosRepository
);

export const crearVideojuego = new CrearVideojuego(
    postgresqlVideojuegosRepository
);

export const actualizarVideojuego = new ActualizarVideojuego(
    postgresqlVideojuegosRepository
);

export const eliminarVideojuego = new EliminarVideojuego(
    postgresqlVideojuegosRepository
);

export const videojuegoControlador = new VideojuegoControlador(
    obtenerVideojuegoPorId,
    obtenerTodosVideojuegos,
    crearVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
);
