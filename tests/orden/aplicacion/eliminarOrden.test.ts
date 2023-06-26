import { EliminarOrden } from '../../../src/orden/aplicacion/eliminarOrden';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlOrdenRepository } from '../../../src/orden/infraestructura/postgresqlOrdenRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

jest.mock('../../../src/orden/infraestructura/postgresqlOrdenRepository');
jest.mock('../../../src/postgreSQL_DB.ts');

describe('EliminarOrden', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const ordenRepositoryMock = new PostgresqlOrdenRepository(
        videojuegoRepositoryMock
    );

    const eliminarOrden = new EliminarOrden(ordenRepositoryMock);

    test('debe llamar al método eliminar del ordenRepository y devolver la orden eliminada si existe', async () => {
        const idOrden = 1;

        const ordenEliminada = {
            id: 1,
            videojuegos_comprados: [
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 3 },
            ],
            cantidad: 5,
            valor_total: 99.99,
            id_usuario: null,
        };

        ordenRepositoryMock.eliminar = jest
            .fn()
            .mockResolvedValue(ordenEliminada);

        const resultado = await eliminarOrden.ejecutar(idOrden);

        expect(ordenRepositoryMock.eliminar).toHaveBeenCalledWith(idOrden);

        expect(resultado).toEqual(ordenEliminada);
    });

    test('debe lanzar un error si la orden no existe', async () => {
        const idOrden = 1;

        ordenRepositoryMock.eliminar = jest.fn().mockResolvedValue(null);

        await expect(eliminarOrden.ejecutar(idOrden)).rejects.toThrow(
            'Orden no encontrada'
        );

        expect(ordenRepositoryMock.eliminar).toHaveBeenCalledWith(idOrden);
    });
});
