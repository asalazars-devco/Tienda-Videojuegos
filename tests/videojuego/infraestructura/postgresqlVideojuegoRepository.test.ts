import { Videojuego } from '../../../src/videojuego/dominio/videojuego';
import { PostgresqlVideojuegosRepository } from '../../../src/videojuego/infraestructura/postgresqlVideojuegosRepository';
import Database from '../../../src/postgreSQL_DB';

const databaseMock = Database.getInstance() as jest.Mocked<Database>;
const videojuegoRepository = new PostgresqlVideojuegosRepository();

describe('PostgresqlVideojuegosRepository', () => {
    beforeEach(() => {
        databaseMock.query = jest.fn();
        databaseMock.query.mockReset();
    });

    describe('obtenerPorId', () => {
        const videojuegoExistente = {
            id: 1,
            nombre: 'Videojuego 1',
            precio: 49.99,
            imagen: 'videojuego1.png',
            stock: 10,
        };

        test('debe obtener un videojuego existente por ID', async () => {
            // Configurar el comportamiento del método query en el mock de Database
            databaseMock.query = jest
                .fn()
                .mockResolvedValue([videojuegoExistente]);

            const idVideojuego = 1;
            const resultado = await videojuegoRepository.obtenerPorId(
                idVideojuego
            );

            // Verificar el resultado
            expect(resultado).toEqual(
                new Videojuego(
                    videojuegoExistente.id,
                    videojuegoExistente.nombre,
                    videojuegoExistente.precio,
                    videojuegoExistente.imagen,
                    videojuegoExistente.stock
                )
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM videojuegos WHERE id = $1',
                [idVideojuego]
            );
        });

        test('debe devolver null si el videojuego no existe por ID', async () => {
            // Configurar el comportamiento del método query en el mock de Database
            databaseMock.query.mockResolvedValue([]);

            const idVideojuego = 1;
            const resultado = await videojuegoRepository.obtenerPorId(
                idVideojuego
            );

            // Verificar el resultado
            expect(resultado).toBeNull();

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM videojuegos WHERE id = $1',
                [idVideojuego]
            );
        });
    });

    describe('obtenerTodo', () => {
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

            databaseMock.query = jest
                .fn()
                .mockResolvedValue(videojuegosExistentes);

            const resultado = await videojuegoRepository.obtenerTodo();

            // Verificar el resultado
            expect(resultado).toEqual(videojuegosExistentes);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM videojuegos'
            );
        });

        test('debe obtener una lista vacía si no existen videojuegos', async () => {
            databaseMock.query = jest.fn().mockResolvedValue([]);

            const resultado = await videojuegoRepository.obtenerTodo();

            // Verificar el resultado
            expect(resultado).toEqual([]);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM videojuegos'
            );
        });
    });

    describe('crear', () => {
        test('debe crear un nuevo videojuego', async () => {
            const videojuegoNuevo = {
                nombre: 'Nuevo Videojuego',
                precio: 29.99,
                imagen: 'nuevo_videojuego.png',
                stock: 5,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([{ id: 1, ...videojuegoNuevo }]);

            const resultado = await videojuegoRepository.crear(
                null,
                videojuegoNuevo.nombre,
                videojuegoNuevo.precio,
                videojuegoNuevo.imagen,
                videojuegoNuevo.stock
            );

            // Verificar el resultado
            expect(resultado).toEqual(
                new Videojuego(
                    1,
                    videojuegoNuevo.nombre,
                    videojuegoNuevo.precio,
                    videojuegoNuevo.imagen,
                    videojuegoNuevo.stock
                )
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO videojuegos (nombre, precio, imagen, stock) VALUES ($1, $2, $3, $4) RETURNING *',
                [
                    videojuegoNuevo.nombre,
                    videojuegoNuevo.precio,
                    videojuegoNuevo.imagen,
                    videojuegoNuevo.stock,
                ]
            );
        });

        test('Si la funcion actualizar no encuentra un videojuego y el nombre del videojuego no existe, debe crear un nuevo videojuego con ID especificado', async () => {
            const videojuegoNuevo = {
                id: 1,
                nombre: 'Nuevo Videojuego',
                precio: 29.99,
                imagen: 'nuevo_videojuego.png',
                stock: 5,
            };

            databaseMock.query = jest.fn().mockResolvedValue([videojuegoNuevo]);

            const resultado = await videojuegoRepository.crear(
                videojuegoNuevo.id,
                videojuegoNuevo.nombre,
                videojuegoNuevo.precio,
                videojuegoNuevo.imagen,
                videojuegoNuevo.stock
            );

            // Verificar el resultado
            expect(resultado).toEqual(
                new Videojuego(
                    videojuegoNuevo.id,
                    videojuegoNuevo.nombre,
                    videojuegoNuevo.precio,
                    videojuegoNuevo.imagen,
                    videojuegoNuevo.stock
                )
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO videojuegos (id, nombre, precio, imagen, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    videojuegoNuevo.id,
                    videojuegoNuevo.nombre,
                    videojuegoNuevo.precio,
                    videojuegoNuevo.imagen,
                    videojuegoNuevo.stock,
                ]
            );
        });

        test('debe lanzar un error si el videojuego no tiene toda la informacion requerida', async () => {
            const videojuegoNuevo = {
                nombre: null,
                precio: 29.99,
                imagen: 'nuevo_videojuego.png',
                stock: 5,
            };

            await expect(
                videojuegoRepository.crear(
                    null,
                    videojuegoNuevo.nombre as any,
                    videojuegoNuevo.precio,
                    videojuegoNuevo.imagen,
                    videojuegoNuevo.stock
                )
            ).rejects.toThrowError();

            expect(databaseMock.query).toHaveBeenCalledWith(
                'DELETE FROM videojuegos WHERE nombre = $1 RETURNING *',
                [videojuegoNuevo.nombre]
            );
        });

        test('Si se intenta crear un nuevo videojuego con un nombre ya existente, debe devolver el videojuego correspondiente al nombre', async () => {
            const videojuegoNuevo = {
                nombre: 'Videojuego Existente',
                precio: 29.99,
                imagen: 'videojuego.png',
                stock: 5,
            };

            const videojuegoExistente = {
                id: 1,
                nombre: 'Videojuego Existente',
                precio: 29.99,
                imagen: 'videojuego.png',
                stock: 5,
            };

            databaseMock.query = jest
                .fn()
                .mockRejectedValueOnce(new Error('llave duplicada'))
                .mockResolvedValueOnce([videojuegoExistente]);

            const resultado = await videojuegoRepository.crear(
                null,
                videojuegoNuevo.nombre,
                videojuegoNuevo.precio,
                videojuegoNuevo.imagen,
                videojuegoNuevo.stock
            );

            // Verificar el resultado
            expect(resultado).toEqual(videojuegoExistente);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM videojuegos WHERE nombre = $1',
                [videojuegoNuevo.nombre]
            );
        });
    });

    describe('actualizar', () => {
        test('debe actualizar un videojuego existente', async () => {
            const videojuegoActualizado = {
                id: 1,
                nombre: 'Videojuego Actualizado',
                precio: 59.99,
                imagen: 'videojuego_actualizado.png',
                stock: 15,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([videojuegoActualizado]);

            const resultado = await videojuegoRepository.actualizar(
                videojuegoActualizado.id,
                videojuegoActualizado.nombre,
                videojuegoActualizado.precio,
                videojuegoActualizado.imagen,
                videojuegoActualizado.stock
            );

            // Verificar el resultado
            expect(resultado).toEqual(videojuegoActualizado);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'UPDATE videojuegos SET nombre = $1, precio = $2, imagen = $3, stock = $4 WHERE id = $5 RETURNING *',
                [
                    videojuegoActualizado.nombre,
                    videojuegoActualizado.precio,
                    videojuegoActualizado.imagen,
                    videojuegoActualizado.stock,
                    videojuegoActualizado.id,
                ]
            );
        });

        test('Si el ID del videojuego a actualizar no existe, debe de crear un nuevo videojuego con este ID', async () => {
            const videojuegoActualizado = {
                id: 1,
                nombre: 'Videojuego Actualizado',
                precio: 59.99,
                imagen: 'videojuego_actualizado.png',
                stock: 15,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([videojuegoActualizado]);

            const resultado = await videojuegoRepository.actualizar(
                videojuegoActualizado.id,
                videojuegoActualizado.nombre,
                videojuegoActualizado.precio,
                videojuegoActualizado.imagen,
                videojuegoActualizado.stock
            );

            // Verificar el resultado
            expect(resultado).toEqual(videojuegoActualizado);
        });

        test('Debe lanzar un error si no se encuentra toda la informacion requerida y correcta para actualizar el videojuego', async () => {
            const videojuegoActualizado = {
                id: null,
                nombre: 'Videojuego Actualizado',
                precio: 59.99,
                imagen: 'videojuego_actualizado.png',
                stock: 15,
            };

            await expect(
                videojuegoRepository.actualizar(
                    videojuegoActualizado.id as any,
                    videojuegoActualizado.nombre,
                    videojuegoActualizado.precio,
                    videojuegoActualizado.imagen,
                    videojuegoActualizado.stock
                )
            ).rejects.toThrowError();
        });
    });

    describe('eliminar', () => {
        test('debe eliminar un videojuego existente', async () => {
            const videojuegoExistente = {
                id: 1,
                nombre: 'Videojuego existente',
                precio: 49.99,
                imagen: 'existente.png',
                stock: 10,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([videojuegoExistente]);

            const resultado = await videojuegoRepository.eliminar(
                videojuegoExistente.id
            );

            // Verificar el resultado
            expect(resultado).toEqual(videojuegoExistente);
        });

        test('debe lanzar un error si el videojuego no existe', async () => {
            const idVideojuegoNoExistente = 1;

            databaseMock.query = jest.fn().mockResolvedValue([]);

            // Verificar el resultado
            await expect(
                videojuegoRepository.eliminar(idVideojuegoNoExistente)
            ).rejects.toThrowError('Videojuego no encontrado');
        });
    });
});
