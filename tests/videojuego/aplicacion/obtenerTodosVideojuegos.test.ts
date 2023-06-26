import { ObtenerTodosVideojuegos } from '../../../src/videojuego/aplicacion/obtenerTodosVideojuegos';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('ObtenerTodosVideojuegos', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
        videojuegoRepositoryMock
    );

    test('debe llamar al método obtenerTodo del videojuegoRepository y devolver todos los videojuegos existentes', async () => {
        const videojuegosExistentes = [
            {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 49.99,
                imagen: 'videojuego1.png',
                stock: 10,
            },
            {
                id: 2,
                nombre: 'Videojuego 2',
                precio: 39.99,
                imagen: 'videojuego2.png',
                stock: 5,
            },
        ];

        videojuegoRepositoryMock.obtenerTodo = jest
            .fn()
            .mockResolvedValue(videojuegosExistentes);

        const resultado = await obtenerTodosVideojuegos.ejecutar();

        expect(resultado).toEqual(videojuegosExistentes);

        expect(videojuegoRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });

    test('debe llamar al método obtenerTodo del videojuegoRepository y obtener una lista vacía si no existen videojuegos', async () => {
        videojuegoRepositoryMock.obtenerTodo = jest.fn().mockResolvedValue([]);

        const resultado = await obtenerTodosVideojuegos.ejecutar();

        expect(resultado).toEqual([]);

        expect(videojuegoRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });
});
