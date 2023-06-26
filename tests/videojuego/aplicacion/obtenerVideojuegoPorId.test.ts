import { ObtenerVideojuegoPorId } from '../../../src/videojuego/aplicacion/obtenerVideojuegoPorId';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('ObtenerVideojuegoPorId', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
        videojuegoRepositoryMock
    );

    test('debe llamar al método obtenerPorId del videojuegoRepository y devolver el videojuego obtenido', async () => {
        const videojuegoExistente = {
            id: 1,
            nombre: 'Videojuego 1',
            precio: 49.99,
            imagen: 'videojuego1.png',
            stock: 10,
        };

        videojuegoRepositoryMock.obtenerPorId = jest
            .fn()
            .mockResolvedValue(videojuegoExistente);

        const idVideojuego = 1;
        const resultado = await obtenerVideojuegoPorId.ejecutar(idVideojuego);

        expect(resultado).toEqual(videojuegoExistente);

        expect(videojuegoRepositoryMock.obtenerPorId).toHaveBeenCalledWith(
            idVideojuego
        );
    });

    test('debe llamar al método obtenerPorId del videojuegoRepository y lanzar un error si el videojuego no existe', async () => {
        videojuegoRepositoryMock.obtenerPorId = jest
            .fn()
            .mockResolvedValue(null);

        const idVideojuego = 1;

        await expect(
            obtenerVideojuegoPorId.ejecutar(idVideojuego)
        ).rejects.toThrowError('Videojuego no encontrado');

        expect(videojuegoRepositoryMock.obtenerPorId).toHaveBeenCalledWith(
            idVideojuego
        );
    });
});
