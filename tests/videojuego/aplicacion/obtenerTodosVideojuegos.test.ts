import { ObtenerTodosVideojuegos } from '../../../src/videojuego/aplicacion/obtenerTodosVideojuegos';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('ObtenerTodosVideojuegos', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
        videojuegoRepositoryMock
    );

    test('debe obtener todos los videojuegos existentes', async () => {
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

        // Configurar el comportamiento del método obtenerTodo en el mock
        videojuegoRepositoryMock.obtenerTodo = jest
            .fn()
            .mockResolvedValue(videojuegosExistentes);

        // Ejecutar la función bajo prueba
        const resultado = await obtenerTodosVideojuegos.ejecutar();

        // Verificar el resultado
        expect(resultado).toEqual(videojuegosExistentes);

        expect(videojuegoRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });

    test('debe obtener una lista vacía si no existen videojuegos', async () => {
        // Configurar el comportamiento del método obtenerTodo en el mock
        videojuegoRepositoryMock.obtenerTodo = jest.fn().mockResolvedValue([]);

        // Ejecutar y verificar el resultado
        const resultado = await obtenerTodosVideojuegos.ejecutar();

        expect(resultado).toEqual([]);

        expect(videojuegoRepositoryMock.obtenerTodo).toHaveBeenCalled();
    });
});
