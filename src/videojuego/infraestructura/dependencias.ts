import { ObtenerVideojuegoPorId } from '../aplicacion/obtenerVideojuegoPorId';
import { ObtenerTodosVideojuegos } from '../aplicacion/obtenerTodosVideojuegos';
import { CrearVideojuego } from '../aplicacion/crearVideojuego';
import { ActualizarVideojuego } from '../aplicacion/actualizarVideojuego';
import { EliminarVideojuego } from '../aplicacion/eliminarVideojuego';

import { PostgresqlVideojuegosRepository } from './postgresqlVideojuegosRepository';
import { VideojuegoControlador } from './videojuegoControlador';

const postgresqlVideojuegosRepository = new PostgresqlVideojuegosRepository();

const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
    postgresqlVideojuegosRepository
);

const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
    postgresqlVideojuegosRepository
);

const crearVideojuego = new CrearVideojuego(postgresqlVideojuegosRepository);

const actualizarVideojuego = new ActualizarVideojuego(
    postgresqlVideojuegosRepository
);

const eliminarVideojuego = new EliminarVideojuego(
    postgresqlVideojuegosRepository
);

export const videojuegoControlador = new VideojuegoControlador(
    obtenerVideojuegoPorId,
    obtenerTodosVideojuegos,
    crearVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
);
