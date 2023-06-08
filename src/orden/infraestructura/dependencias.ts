import { ObtenerTodasOrdenes } from '../aplicacion/obtenerTodasOrdenes';
import { ObtenerOrdenPorId } from '../aplicacion/obtenerOrdenPorId';
import { CrearOrden } from '../aplicacion/crearOrden';
import { EliminarOrden } from '../aplicacion/eliminarOrden';

import { PostgresqlOrdenRepository } from './postgresqlOrdenRepository';
import { PostgresqlVideojuegosRepository } from '../../videojuego/infraestructura/postgresqlVideojuegosRepository';
import { OrdenControlador } from './ordenControlador';

const postgresqlVideojuegosRepository = new PostgresqlVideojuegosRepository();
const postgresqlOrdenRepository = new PostgresqlOrdenRepository(
    postgresqlVideojuegosRepository
);

const obtenerTodasOrdenes = new ObtenerTodasOrdenes(postgresqlOrdenRepository);

const obtenerOrdenPorId = new ObtenerOrdenPorId(postgresqlOrdenRepository);

const crearOrden = new CrearOrden(postgresqlOrdenRepository);

const eliminarOrden = new EliminarOrden(postgresqlOrdenRepository);

export const ordenControlador = new OrdenControlador(
    obtenerTodasOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    eliminarOrden
);
