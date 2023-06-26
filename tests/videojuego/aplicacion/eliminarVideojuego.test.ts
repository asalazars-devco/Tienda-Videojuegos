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

    test('debe llamar al método eliminar del videojuegoRepository y devolver el videojuego eliminado', async () => {
        const videojuegoExistente = {
            id: 1,
            nombre: 'Videojuego existente',
            precio: 49.99,
            imagen: 'existente.png',
            stock: 10,
        };

        const resultado = await eliminarVideojuego.ejecutar(
            videojuegoExistente.id
        );

        expect(resultado).toEqual(videojuegoExistente);

        expect(videojuegoRepositoryMock.eliminar).toHaveBeenCalledWith(
            videojuegoExistente.id
        );
    });

    test('debe llamar al método eliminar del videojuegoRepository y lanzar un error si el videojuego no existe', async () => {
        const idVideojuegoNoExistente = 2;

        await expect(
            eliminarVideojuego.ejecutar(idVideojuegoNoExistente)
        ).rejects.toThrow('Videojuego no encontrado');

        expect(videojuegoRepositoryMock.eliminar).toHaveBeenCalledWith(
            idVideojuegoNoExistente
        );
    });
});
