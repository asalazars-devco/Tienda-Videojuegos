import { ObtenerVideojuegoPorId } from '../../../src/videojuego/aplicacion/obtenerVideojuegoPorId';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('ObtenerVideojuegoPorId', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
        videojuegoRepositoryMock
    );

    test('debe obtener el videojuego correcto por ID', async () => {
        const videojuegoExistente = {
            id: 1,
            nombre: 'Videojuego 1',
            precio: 49.99,
            imagen: 'videojuego1.png',
            stock: 10,
        };

        // Configurar el comportamiento del método obtenerPorId en el mock
        videojuegoRepositoryMock.obtenerPorId = jest
            .fn()
            .mockResolvedValue(videojuegoExistente);

        // Ejecutar la función bajo prueba
        const idVideojuego = 1;
        const resultado = await obtenerVideojuegoPorId.ejecutar(idVideojuego);

        // Verificar el resultado
        expect(resultado).toEqual(videojuegoExistente);

        expect(videojuegoRepositoryMock.obtenerPorId).toHaveBeenCalledWith(
            idVideojuego
        );
    });

    test('debe lanzar un error si el videojuego no existe', async () => {
        // Configurar el comportamiento del método obtenerPorId en el mock
        videojuegoRepositoryMock.obtenerPorId = jest
            .fn()
            .mockResolvedValue(null);

        // Ejecutar y verificar el resultado
        const idVideojuego = 1;

        await expect(
            obtenerVideojuegoPorId.ejecutar(idVideojuego)
        ).rejects.toThrowError('Videojuego no encontrado');

        expect(videojuegoRepositoryMock.obtenerPorId).toHaveBeenCalledWith(
            idVideojuego
        );
    });
});
