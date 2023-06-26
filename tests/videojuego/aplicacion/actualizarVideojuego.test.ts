import { ActualizarVideojuego } from '../../../src/videojuego/aplicacion/actualizarVideojuego';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';

describe('ActualizarVideojuego', () => {
    const videojuegoRepositoryMock =
        new PostgresqlVideojuegosRepository() as jest.Mocked<VideojuegoRepository>;

    videojuegoRepositoryMock.actualizar = jest
        .fn()
        .mockImplementation(
            (
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            ) => {
                const idVideojuegoExistente = 1;
                if (idVideojuego === idVideojuegoExistente) {
                    return Promise.resolve({
                        id: idVideojuego,
                        nombre: nombreVideojuego,
                        precio: precioVideojuego,
                        imagen: imagenVideojuego,
                        stock: stockVideojuego,
                    });
                }
            }
        );

    const actualizarVideojuego = new ActualizarVideojuego(
        videojuegoRepositoryMock
    );

    test('debe llamar al método actualizar del videojuegoRepository y devolver el videojuego actualizado', async () => {
        const idVideojuego = 1;
        const nombreVideojuego = 'Nuevo Nombre';
        const precioVideojuego = 59.99;
        const imagenVideojuego = 'nuevo.png';
        const stockVideojuego = 20;

        const videojuegoActualizado = await actualizarVideojuego.ejecutar(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        expect(videojuegoRepositoryMock.actualizar).toHaveBeenCalledWith(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        expect(videojuegoActualizado).toEqual({
            id: idVideojuego,
            nombre: nombreVideojuego,
            precio: precioVideojuego,
            imagen: imagenVideojuego,
            stock: stockVideojuego,
        });
    });

    test('debe llamar al método actualizar del videojuegoRepository y lanzar un error al intentar actualizar un videojuego inexistente', async () => {
        const idVideojuego = 2;
        const nombreVideojuego = 'Nuevo Nombre';
        const precioVideojuego = 59.99;
        const imagenVideojuego = 'nuevo.png';
        const stockVideojuego = 20;

        await expect(
            actualizarVideojuego.ejecutar(
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            )
        ).rejects.toThrowError('Videojuego no encontrado');

        expect(videojuegoRepositoryMock.actualizar).toHaveBeenCalledWith(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );
    });
});
