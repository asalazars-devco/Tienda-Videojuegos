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

    // Instancia de ActualizarVideojuego con el VideojuegoRepository mockeado
    const actualizarVideojuego = new ActualizarVideojuego(
        videojuegoRepositoryMock
    );

    // Prueba para verificar que se actualice correctamente un videojuego
    test('debe actualizar un videojuego existente', async () => {
        const idVideojuego = 1;
        const nombreVideojuego = 'Nuevo Nombre';
        const precioVideojuego = 59.99;
        const imagenVideojuego = 'nuevo.png';
        const stockVideojuego = 20;

        // Ejecutar el método actualizar
        const videojuegoActualizado = await actualizarVideojuego.ejecutar(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        // Verificar que se haya llamado al método actualizar del VideojuegoRepository
        expect(videojuegoRepositoryMock.actualizar).toHaveBeenCalledWith(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        // Verificar que se haya devuelto el videojuego actualizado
        expect(videojuegoActualizado).toEqual({
            id: idVideojuego,
            nombre: nombreVideojuego,
            precio: precioVideojuego,
            imagen: imagenVideojuego,
            stock: stockVideojuego,
        });
    });

    // Prueba para verificar que se lance un error al intentar actualizar un videojuego inexistente
    test('debe lanzar un error al intentar actualizar un videojuego inexistente', async () => {
        const idVideojuego = 2;
        const nombreVideojuego = 'Nuevo Nombre';
        const precioVideojuego = 59.99;
        const imagenVideojuego = 'nuevo.png';
        const stockVideojuego = 20;

        // Ejecutar el método actualizar y esperar que lance un error
        await expect(
            actualizarVideojuego.ejecutar(
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            )
        ).rejects.toThrowError('Videojuego no encontrado');

        // Verificar que se haya llamado al método actualizar del VideojuegoRepository
        expect(videojuegoRepositoryMock.actualizar).toHaveBeenCalledWith(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );
    });
});
