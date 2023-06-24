import { CrearOrden } from '../../../src/orden/aplicacion/crearOrden';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlOrdenRepository } from '../../../src/orden/infraestructura/postgresqlOrdenRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

jest.mock('../../../src/orden/infraestructura/postgresqlOrdenRepository');
jest.mock('../../../src/postgreSQL_DB.ts');

describe('CrearOrden', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const ordenRepositoryMock = new PostgresqlOrdenRepository(
        videojuegoRepositoryMock
    );

    ordenRepositoryMock.crear = jest
        .fn()
        .mockImplementation((videojuegos_comprados, id_usuario) => {
            return Promise.resolve({
                id: 1,
                videojuegos_comprados,
                cantidad: 5,
                valor_total: 99.99,
                id_usuario,
            });
        });

    const crearOrden = new CrearOrden(ordenRepositoryMock);

    test('debe crear una orden', async () => {
        const videojuegosComprados = [
            { id: 1, cantidad: 2 },
            { id: 2, cantidad: 3 },
        ];
        const idUsuario = 1;

        const ordenCreada = {
            id: 1,
            videojuegos_comprados: videojuegosComprados,
            cantidad: 5,
            valor_total: 99.99,
            id_usuario: idUsuario,
        };

        const resultado = await crearOrden.ejecutar(
            videojuegosComprados,
            idUsuario
        );

        expect(ordenRepositoryMock.crear).toHaveBeenCalledWith(
            videojuegosComprados,
            idUsuario
        );

        expect(resultado).toEqual(ordenCreada);
    });
});
