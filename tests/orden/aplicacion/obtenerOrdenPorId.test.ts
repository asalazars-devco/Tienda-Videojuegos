import { ObtenerOrdenPorId } from '../../../src/orden/aplicacion/obtenerOrdenPorId';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlOrdenRepository } from '../../../src/orden/infraestructura/postgresqlOrdenRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

jest.mock('../../../src/orden/infraestructura/postgresqlOrdenRepository');
jest.mock('../../../src/postgreSQL_DB.ts');

describe('ObtenerOrdenPorId', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const ordenRepositoryMock = new PostgresqlOrdenRepository(
        videojuegoRepositoryMock
    );

    const obtenerOrdenPorId = new ObtenerOrdenPorId(ordenRepositoryMock);

    test('debe obtener una orden por su ID', async () => {
        const idOrden = 1;

        const ordenObtenida = {
            id: 1,
            videojuegos_comprados: [
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 3 },
            ],
            cantidad: 5,
            valor_total: 99.99,
            id_usuario: null,
        };

        ordenRepositoryMock.obtenerPorId = jest
            .fn()
            .mockResolvedValue(ordenObtenida);

        const resultado = await obtenerOrdenPorId.ejecutar(idOrden);

        expect(ordenRepositoryMock.obtenerPorId).toHaveBeenCalledWith(idOrden);

        expect(resultado).toEqual(ordenObtenida);
    });

    test('debe lanzar un error si la orden no existe', async () => {
        const idOrden = 1;

        ordenRepositoryMock.obtenerPorId = jest.fn().mockResolvedValue(null);

        await expect(obtenerOrdenPorId.ejecutar(idOrden)).rejects.toThrow(
            'Orden no encontrada'
        );

        expect(ordenRepositoryMock.obtenerPorId).toHaveBeenCalledWith(idOrden);
    });
});
