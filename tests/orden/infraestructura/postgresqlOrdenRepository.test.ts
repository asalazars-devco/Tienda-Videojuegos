import { Orden } from '../../../src/orden/dominio/orden';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';
import { OrdenRepository } from '../../../src/orden/dominio/ordenRepository';
import { PostgresqlOrdenRepository } from '../../../src/orden/infraestructura/postgresqlOrdenRepository';
import Database from '../../../src/postgreSQL_DB';

const databaseMock = Database.getInstance() as jest.Mocked<Database>;

describe('PostgresqlOrdenRepository', () => {
    let ordenRepository: OrdenRepository;
    let mockVideojuegoRepository: VideojuegoRepository;

    beforeEach(() => {
        mockVideojuegoRepository = {
            obtenerPorId: jest.fn(),
            obtenerTodo: jest.fn(),
            crear: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
        };

        ordenRepository = new PostgresqlOrdenRepository(
            mockVideojuegoRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('obtenerTodo', () => {
        test('debe obtener todas las ordenes existentes', async () => {
            const ordenes = [
                {
                    id: 1,
                    videojuegos_comprados: [
                        { id: 1, cantidad: 2 },
                        { id: 2, cantidad: 1 },
                    ],
                    cantidad: 3,
                    valor_total: 150,
                    id_usuario: 1,
                },
                {
                    id: 2,
                    videojuegos_comprados: [{ id: 3, cantidad: 1 }],
                    cantidad: 1,
                    valor_total: 50,
                    id_usuario: null,
                },
            ];

            databaseMock.query = jest.fn().mockResolvedValue(ordenes);

            const resultado = await ordenRepository.obtenerTodo();

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM ordenes'
            );
            expect(resultado).toHaveLength(2);

            expect(resultado[0]).toBeInstanceOf(Orden);
            expect(resultado[0].videojuegos_comprados).toEqual([
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 1 },
            ]);
            expect(resultado[0].obtenerCantidad()).toBe(3);
            expect(resultado[0]).toHaveProperty('valor_total', 150);
            expect(resultado[0]).toHaveProperty('id', 1);
            expect(resultado[0]).toHaveProperty('id_usuario', 1);

            expect(resultado[1]).toBeInstanceOf(Orden);
            expect(resultado[1].videojuegos_comprados).toEqual([
                { id: 3, cantidad: 1 },
            ]);
            expect(resultado[1].obtenerCantidad()).toBe(1);
            expect(resultado[1]).toHaveProperty('valor_total', 50);
            expect(resultado[1]).toHaveProperty('id', 2);
            expect(resultado[1]).toHaveProperty('id_usuario', null);
        });
    });

    describe('obtenerPorId', () => {
        test('debe obtener una orden por su ID', async () => {
            const orden = {
                id: 1,
                videojuegos_comprados: [
                    { id: 1, cantidad: 2 },
                    { id: 2, cantidad: 1 },
                ],
                cantidad: 3,
                valor_total: 150,
                id_usuario: 1,
            };

            databaseMock.query = jest.fn().mockResolvedValue([orden]);

            const resultado = await ordenRepository.obtenerPorId(1);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM ordenes WHERE id = $1',
                [1]
            );
            expect(resultado).toBeInstanceOf(Orden);
            expect(resultado.videojuegos_comprados).toEqual([
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 1 },
            ]);
            expect(resultado.obtenerCantidad()).toBe(3);
            expect(resultado).toHaveProperty('valor_total', 150);
            expect(resultado).toHaveProperty('id', 1);
            expect(resultado).toHaveProperty('id_usuario', 1);
        });

        test('debe lanzar un error si la orden no existe', async () => {
            databaseMock.query = jest.fn().mockResolvedValue([]);

            await expect(ordenRepository.obtenerPorId(1)).rejects.toThrow(
                'Orden no encontrada'
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM ordenes WHERE id = $1',
                [1]
            );
        });
    });

    describe('crear', () => {
        test('debe crear una nueva orden', async () => {
            const videojuegos_compradosOrden = [
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 1 },
            ];
            const id_usuario = 1;

            const videojuego1 = {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 50,
                imagen: 'imagen1.jpg',
                stock: 5,
            };
            const videojuego2 = {
                id: 2,
                nombre: 'Videojuego 2',
                precio: 30,
                imagen: 'imagen2.jpg',
                stock: 10,
            };

            mockVideojuegoRepository.obtenerPorId = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2)
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2);

            mockVideojuegoRepository.actualizar = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2);

            const crearOrdenResultado = [
                {
                    id: 1,
                    videojuegos_comprados: JSON.stringify(
                        videojuegos_compradosOrden
                    ),
                    cantidad: 3,
                    valor_total: 130,
                    id_usuario: id_usuario,
                },
            ];

            databaseMock.query = jest
                .fn()
                .mockResolvedValue(crearOrdenResultado);

            const resultado = await ordenRepository.crear(
                videojuegos_compradosOrden,
                id_usuario
            );

            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledTimes(
                4
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                1
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                2
            );

            expect(mockVideojuegoRepository.actualizar).toHaveBeenCalledTimes(
                2
            );
            expect(mockVideojuegoRepository.actualizar).toHaveBeenCalledWith(
                1,
                'Videojuego 1',
                50,
                'imagen1.jpg',
                3
            );
            expect(mockVideojuegoRepository.actualizar).toHaveBeenCalledWith(
                2,
                'Videojuego 2',
                30,
                'imagen2.jpg',
                9
            );

            expect(databaseMock.query).toHaveBeenCalledTimes(1);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO ordenes (videojuegos_comprados, cantidad, valor_total, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *',
                [JSON.stringify(videojuegos_compradosOrden), 3, 130, id_usuario]
            );

            expect(resultado).toBeInstanceOf(Orden);
            expect(resultado.videojuegos_comprados).toEqual(
                videojuegos_compradosOrden
            );
            expect(resultado.obtenerCantidad()).toBe(3);
            expect(resultado).toHaveProperty('valor_total', 130);
            expect(resultado).toHaveProperty('id', 1);
            expect(resultado).toHaveProperty('id_usuario', id_usuario);
        });

        test('debe lanzar un error si un videojuego no existe', async () => {
            const videojuegos_compradosOrden = [
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 1 },
            ];
            const id_usuario = 1;

            const videojuego1 = null;
            const videojuego2 = {
                id: 2,
                nombre: 'Videojuego 2',
                precio: 30,
                imagen: 'imagen2.jpg',
                stock: 10,
            };

            mockVideojuegoRepository.obtenerPorId = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2);

            await expect(
                ordenRepository.crear(videojuegos_compradosOrden, id_usuario)
            ).rejects.toThrow('Videojuego con ID 1 no encontrado');

            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledTimes(
                2
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                1
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                2
            );

            expect(mockVideojuegoRepository.actualizar).not.toHaveBeenCalled();

            expect(databaseMock.query).not.toHaveBeenCalled();
        });

        test('debe lanzar un error si la cantidad a comprar no está especificada', async () => {
            const videojuegos_compradosOrden = [
                { id: 1, cantidad: 2 },
                { id: 2 },
            ];
            const id_usuario = 1;

            const videojuego1 = {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 50,
                imagen: 'imagen1.jpg',
                stock: 5,
            };
            const videojuego2 = {
                id: 2,
                nombre: 'Videojuego 2',
                precio: 30,
                imagen: 'imagen2.jpg',
                stock: 10,
            };

            mockVideojuegoRepository.obtenerPorId = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2);

            await expect(
                ordenRepository.crear(
                    videojuegos_compradosOrden as any,
                    id_usuario
                )
            ).rejects.toThrow(
                'Cantidad a comprar del videojuego con ID 2 no especificada'
            );

            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledTimes(
                2
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                1
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                2
            );

            expect(mockVideojuegoRepository.actualizar).not.toHaveBeenCalled();

            expect(databaseMock.query).not.toHaveBeenCalled();
        });

        test('debe lanzar un error si no hay suficiente stock disponible', async () => {
            const videojuegos_compradosOrden = [
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 5 },
            ];
            const id_usuario = 1;

            const videojuego1 = {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 50,
                imagen: 'imagen1.jpg',
                stock: 5,
            };
            const videojuego2 = {
                id: 2,
                nombre: 'Videojuego 2',
                precio: 30,
                imagen: 'imagen2.jpg',
                stock: 3,
            };

            mockVideojuegoRepository.obtenerPorId = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego2);

            await expect(
                ordenRepository.crear(videojuegos_compradosOrden, id_usuario)
            ).rejects.toThrow(
                'No hay suficiente stock disponible del videojuego con ID 2'
            );

            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledTimes(
                2
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                1
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                2
            );

            expect(mockVideojuegoRepository.actualizar).not.toHaveBeenCalled();

            expect(databaseMock.query).not.toHaveBeenCalled();
        });

        test('debe lanzar un error si los campos de los videojuegos comprados estan mal diligenciados', async () => {
            const videojuegos_compradosOrden = [
                { id: 1, cantidad: 'k' as any },
            ];

            const videojuego1 = {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 50,
                imagen: 'imagen1.jpg',
                stock: 5,
            };

            mockVideojuegoRepository.obtenerPorId = jest
                .fn()
                .mockResolvedValueOnce(videojuego1)
                .mockResolvedValueOnce(videojuego1);

            databaseMock.query = jest
                .fn()
                .mockRejectedValueOnce(new Error('sintaxis'));

            await expect(
                ordenRepository.crear(videojuegos_compradosOrden, null)
            ).rejects.toThrowError(
                'Campos de los videojuegos comprados mal diligenciados'
            );

            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledTimes(
                1
            );
            expect(mockVideojuegoRepository.obtenerPorId).toHaveBeenCalledWith(
                1
            );

            expect(databaseMock.query).toHaveBeenCalledTimes(1);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO ordenes (videojuegos_comprados, cantidad, valor_total, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *',
                [JSON.stringify(videojuegos_compradosOrden), '0k', NaN, null]
            );
        });
    });

    describe('eliminar', () => {
        test('debe eliminar la orden y devolverla', async () => {
            const idOrden = 1;
            const ordenEliminadaDB = {
                id: idOrden,
                videojuegos_comprados: [
                    { id: 1, cantidad: 2 },
                    { id: 2, cantidad: 3 },
                ],
                cantidad: 5,
                valor_total: 150,
                id_usuario: 1,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValueOnce([ordenEliminadaDB]);

            const ordenEliminada = await ordenRepository.eliminar(idOrden);

            expect(databaseMock.query).toHaveBeenCalledTimes(1);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'DELETE FROM ordenes WHERE id = $1 RETURNING *',
                [idOrden]
            );

            expect(ordenEliminada).toBeInstanceOf(Orden);
            expect(ordenEliminada.videojuegos_comprados).toEqual([
                { id: 1, cantidad: 2 },
                { id: 2, cantidad: 3 },
            ]);
            expect(ordenEliminada.obtenerCantidad()).toBe(5);
            expect(ordenEliminada).toHaveProperty('valor_total', 150);
            expect(ordenEliminada).toHaveProperty('id', idOrden);
            expect(ordenEliminada).toHaveProperty('id_usuario', 1);
        });

        test('debe lanzar un error si la orden no existe', async () => {
            const idOrden = 1;

            databaseMock.query = jest.fn().mockResolvedValueOnce([]);

            await expect(ordenRepository.eliminar(idOrden)).rejects.toThrow(
                'Orden no encontrada'
            );

            expect(databaseMock.query).toHaveBeenCalledTimes(1);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'DELETE FROM ordenes WHERE id = $1 RETURNING *',
                [idOrden]
            );
        });
    });
});
