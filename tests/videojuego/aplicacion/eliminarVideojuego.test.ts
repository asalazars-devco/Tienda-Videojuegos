import { EliminarVideojuego } from '../../../src/videojuego/aplicacion/eliminarVideojuego';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('EliminarVideojuego', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    videojuegoRepositoryMock.eliminar = jest
        .fn()
        .mockImplementation((idVideojuego) => {
            const idVideojuegoExistente = 1;
            if (idVideojuego === idVideojuegoExistente) {
                return Promise.resolve({
                    id: 1,
                    nombre: 'Videojuego existente',
                    precio: 49.99,
                    imagen: 'existente.png',
                    stock: 10,
                });
            }
        });

    const eliminarVideojuego = new EliminarVideojuego(videojuegoRepositoryMock);

    test('debe eliminar un videojuego existente', async () => {
        const videojuegoExistente = {
            id: 1,
            nombre: 'Videojuego existente',
            precio: 49.99,
            imagen: 'existente.png',
            stock: 10,
        };

        // Ejecutar la función bajo prueba
        const resultado = await eliminarVideojuego.ejecutar(
            videojuegoExistente.id
        );

        // Verificar el resultado
        expect(resultado).toEqual(videojuegoExistente);

        expect(videojuegoRepositoryMock.eliminar).toHaveBeenCalledWith(
            videojuegoExistente.id
        );
    });

    test('debe lanzar un error si el videojuego no existe', async () => {
        const idVideojuegoNoExistente = 2;

        // Ejecutar y verificar que se lance un error
        await expect(
            eliminarVideojuego.ejecutar(idVideojuegoNoExistente)
        ).rejects.toThrow('Videojuego no encontrado');

        expect(videojuegoRepositoryMock.eliminar).toHaveBeenCalledWith(
            idVideojuegoNoExistente
        );
    });
});
