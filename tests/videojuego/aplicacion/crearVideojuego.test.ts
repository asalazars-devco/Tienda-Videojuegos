import { CrearVideojuego } from '../../../src/videojuego/aplicacion/crearVideojuego';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('CrearVideojuego', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    videojuegoRepositoryMock.crear = jest
        .fn()
        .mockImplementation(
            (
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            ) => {
                return Promise.resolve({
                    id: 1,
                    nombre: nombreVideojuego,
                    precio: precioVideojuego,
                    imagen: imagenVideojuego,
                    stock: stockVideojuego,
                });
            }
        );

    const crearVideojuego = new CrearVideojuego(videojuegoRepositoryMock);

    test('debe llamar al método crear del videojuegoRepository y devolver el videojuego creado', async () => {
        const nuevoVideojuego = {
            id: 1,
            nombre: 'Nuevo Videojuego',
            precio: 49.99,
            imagen: 'nuevo.png',
            stock: 10,
        };

        const resultado = await crearVideojuego.ejecutar(
            null,
            nuevoVideojuego.nombre,
            nuevoVideojuego.precio,
            nuevoVideojuego.imagen,
            nuevoVideojuego.stock
        );

        expect(resultado).toEqual(nuevoVideojuego);

        expect(videojuegoRepositoryMock.crear).toHaveBeenCalledWith(
            null,
            nuevoVideojuego.nombre,
            nuevoVideojuego.precio,
            nuevoVideojuego.imagen,
            nuevoVideojuego.stock
        );
    });
});
