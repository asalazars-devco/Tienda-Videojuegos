import { ObtenerTodasOrdenes } from '../../../src/orden/aplicacion/obtenerTodasOrdenes';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlOrdenRepository } from '../../../src/orden/infraestructura/postgresqlOrdenRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

jest.mock('../../../src/orden/infraestructura/postgresqlOrdenRepository');
jest.mock('../../../src/postgreSQL_DB.ts');

describe('ObtenerTodasOrdenes', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const ordenRepositoryMock = new PostgresqlOrdenRepository(
        videojuegoRepositoryMock
    );

    const obtenerTodasOrdenes = new ObtenerTodasOrdenes(ordenRepositoryMock);

    test('debe llamar al método obtenerTodo del ordenRepository y devolver las ordenes existentes', async () => {
        const ordenesExistentes = [
            {
                id: 1,
                videojuegos_comprados: [
                    { id: 1, cantidad: 2 },
                    { id: 2, cantidad: 3 },
                ],
                cantidad: 5,
                valor_total: 99.99,
                id_usuario: null,
            },
            {
                id: 2,
                videojuegos_comprados: [{ id: 3, cantidad: 1 }],
                cantidad: 1,
                valor_total: 29.99,
                id_usuario: 2,
            },
        ];

        ordenRepositoryMock.obtenerTodo = jest
            .fn()
            .mockResolvedValue(ordenesExistentes);

        const resultado = await obtenerTodasOrdenes.ejecutar();

        expect(resultado).toEqual(ordenesExistentes);

        expect(ordenRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });

    test('debe llamar al método obtenerTodo del ordenRepository y obtener una lista vacía si no existen ordenes', async () => {
        ordenRepositoryMock.obtenerTodo = jest.fn().mockResolvedValue([]);

        const resultado = await obtenerTodasOrdenes.ejecutar();

        expect(resultado).toEqual([]);

        expect(ordenRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });
});
