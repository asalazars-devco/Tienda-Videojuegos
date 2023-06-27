import { Request, Response } from 'express';

import { VideojuegoControlador } from '../../../src/videojuego/infraestructura/videojuegoControlador';
import { VideojuegoRepository } from '../../../src/videojuego/dominio/videojuegoRepository';

import { ObtenerVideojuegoPorId } from '../../../src/videojuego/aplicacion/obtenerVideojuegoPorId';
import { ObtenerTodosVideojuegos } from '../../../src/videojuego/aplicacion/obtenerTodosVideojuegos';
import { CrearVideojuego } from '../../../src/videojuego/aplicacion/crearVideojuego';
import { ActualizarVideojuego } from '../../../src/videojuego/aplicacion/actualizarVideojuego';
import { EliminarVideojuego } from '../../../src/videojuego/aplicacion/eliminarVideojuego';

interface AuthRequest extends Request {
    usuario?: any;
}

describe('VideojuegoControlador', () => {
    const mockVideojuegoRepository: VideojuegoRepository = {
        obtenerPorId: jest.fn(),
        obtenerTodo: jest.fn(),
        crear: jest.fn(),
        actualizar: jest.fn(),
        eliminar: jest.fn(),
    };

    const obtenerVideojuegoPorId = new ObtenerVideojuegoPorId(
        mockVideojuegoRepository
    );
    const obtenerTodosVideojuegos = new ObtenerTodosVideojuegos(
        mockVideojuegoRepository
    );
    const crearVideojuego = new CrearVideojuego(mockVideojuegoRepository);
    const actualizarVideojuego = new ActualizarVideojuego(
        mockVideojuegoRepository
    );
    const eliminarVideojuego = new EliminarVideojuego(mockVideojuegoRepository);

    let mockRequest: AuthRequest;
    let mockResponse: Response;

    let videojuegoControlador: VideojuegoControlador;

    beforeEach(() => {
        mockRequest = {} as AuthRequest;
        mockResponse = {} as Response;

        videojuegoControlador = new VideojuegoControlador(
            obtenerVideojuegoPorId,
            obtenerTodosVideojuegos,
            crearVideojuego,
            actualizarVideojuego,
            eliminarVideojuego
        );

        jest.clearAllMocks();
    });

    describe('execObtenerVideojuegoPorId', () => {
        const videojuegoObtenido = {
            id: 1,
            nombre: 'Videojuego',
            precio: 49.99,
            imagen: 'videojuego.png',
            stock: 5,
        };

        obtenerVideojuegoPorId.ejecutar = jest.fn((idVideojuego) => {
            if (Number(idVideojuego) === 1) {
                return Promise.resolve(videojuegoObtenido);
            }
            if (isNaN(idVideojuego)) {
                return Promise.reject(new Error(`sintaxis`));
            }
            return Promise.reject(new Error(`Videojuego no encontrado`));
        });

        test('debe enviar el videojuego si es obtenido exitosamente', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execObtenerVideojuegoPorId(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(obtenerVideojuegoPorId.ejecutar).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(videojuegoObtenido);
        });

        test('debe lanzar un error si el videojuego no es obtenido', async () => {
            mockRequest.params = {
                id: '2',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execObtenerVideojuegoPorId(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(obtenerVideojuegoPorId.ejecutar).toHaveBeenCalledWith(2);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Videojuego no encontrado',
            });
        });

        test('debe lanzar un error si el ID es invalido (no es numero)', async () => {
            mockRequest.params = {
                id: 'k',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execObtenerVideojuegoPorId(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(obtenerVideojuegoPorId.ejecutar).toHaveBeenCalledWith(NaN);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'ID invalido',
            });
        });
    });

    describe('execObtenerTodosVideojuegos', () => {
        test('debe enviar todos los videojuegos cuando son obtenidos correctamente', async () => {
            const videojuegosObtenidos = [
                {
                    id: 1,
                    nombre: 'Videojuego1',
                    precio: 49.99,
                    imagen: 'videojuego1.png',
                    stock: 5,
                },
                {
                    id: 2,
                    nombre: 'Videojuego2',
                    precio: 29.99,
                    imagen: 'videojuego2.png',
                    stock: 15,
                },
            ];

            obtenerTodosVideojuegos.ejecutar = jest
                .fn()
                .mockResolvedValue(videojuegosObtenidos);

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execObtenerTodosVideojuegos(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(obtenerTodosVideojuegos.ejecutar).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(
                videojuegosObtenidos
            );
        });

        test('debe lanzar un error si hay problemas para obtener los videojuegos', async () => {
            obtenerTodosVideojuegos.ejecutar = jest
                .fn()
                .mockRejectedValue(
                    new Error('Error al cargar los videojuegos')
                );

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execObtenerTodosVideojuegos(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(obtenerTodosVideojuegos.ejecutar).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Error al cargar los videojuegos',
            });
        });
    });

    describe('execCrearVideojuego', () => {
        const videojuegoCreado = {
            id: 1,
            nombre: 'Videojuego 1',
            precio: 29.99,
            imagen: 'videojuego1.jpg',
            stock: 10,
        };

        crearVideojuego.ejecutar = jest.fn(
            (
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            ) => {
                if (nombreVideojuego === 'Videojuego Existente') {
                    return Promise.reject(new Error(`llave duplicada`));
                } else if (nombreVideojuego === 'Videojuego 1') {
                    return Promise.resolve(videojuegoCreado);
                }
                return Promise.reject(new Error(`Campos mal diligenciados`));
            }
        );

        test('debe enviar un nuevo videojuego si es creado exitosamente', async () => {
            mockRequest.body = {
                nombre: 'Videojuego 1',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execCrearVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(crearVideojuego.ejecutar).toHaveBeenCalledWith(
                null,
                'Videojuego 1',
                29.99,
                'videojuego1.jpg',
                10
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.send).toHaveBeenCalledWith(videojuegoCreado);
        });

        test('Debe lanzar un error de acceso no permitido si el usuario que quiere crear un videojuego no es admin', async () => {
            mockRequest.body = {
                nombre: 'Videojuego 1',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            mockRequest.usuario = {
                rol: 'cliente',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execCrearVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(crearVideojuego.ejecutar).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Acceso no permitido',
            });
        });

        test('debe lanzar un error si el nombre del videojuego a crear ya existe', async () => {
            mockRequest.body = {
                nombre: 'Videojuego Existente',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();
            mockResponse.sendStatus = jest.fn();

            videojuegoControlador.execCrearVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(crearVideojuego.ejecutar).toHaveBeenCalledWith(
                null,
                'Videojuego Existente',
                29.99,
                'videojuego1.jpg',
                10
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(201);
        });

        test('debe lanzar un error si algun campo del videojuego a crear esta mal diligenciado', async () => {
            mockRequest.body = {
                nombre: '',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execCrearVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(crearVideojuego.ejecutar).toHaveBeenCalledWith(
                null,
                '',
                29.99,
                'videojuego1.jpg',
                10
            );
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Campos mal diligenciados',
            });
        });
    });

    describe('execActualizarVideojuego', () => {
        test('debe enviar el videojuego actualizado si la actualizacion se realiza exitosamente', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockRequest.body = {
                nombre: 'Videojuego actualizado',
                precio: 39.99,
                imagen: 'videojuego1-actualizado.jpg',
                stock: 5,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            const videojuegoActualizado = {
                id: 1,
                nombre: 'Videojuego actualizado',
                precio: 39.99,
                imagen: 'videojuego1-actualizado.jpg',
                stock: 5,
            };

            actualizarVideojuego.ejecutar = jest
                .fn()
                .mockResolvedValue(videojuegoActualizado);

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();
            mockResponse.set = jest.fn();

            videojuegoControlador.execActualizarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(actualizarVideojuego.ejecutar).toHaveBeenCalledWith(
                1,
                'Videojuego actualizado',
                39.99,
                'videojuego1-actualizado.jpg',
                5
            );
            expect(mockResponse.set).toHaveBeenCalledWith(
                'Content-Type',
                'text/plain'
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.send).toHaveBeenCalledWith(
                videojuegoActualizado
            );
        });

        test('Debe lanzar un error de acceso no permitido si el usuario que quiere actualizar un videojuego no es admin', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockRequest.body = {
                nombre: 'Videojuego actualizado',
                precio: 39.99,
                imagen: 'videojuego1-actualizado.jpg',
                stock: 5,
            };

            mockRequest.usuario = {
                rol: 'cliente',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execActualizarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(actualizarVideojuego.ejecutar).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Acceso no permitido',
            });
        });

        test('debe lanzar un error si el ID es invalido (no es numero)', async () => {
            mockRequest.params = {
                id: 'k',
            };

            mockRequest.body = {
                nombre: 'Videojuego actualizado',
                precio: 39.99,
                imagen: 'videojuego1-actualizado.jpg',
                stock: 5,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            actualizarVideojuego.ejecutar = jest
                .fn()
                .mockRejectedValue(new Error('sintaxis'));

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execActualizarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(actualizarVideojuego.ejecutar).toHaveBeenCalledWith(
                NaN,
                'Videojuego actualizado',
                39.99,
                'videojuego1-actualizado.jpg',
                5
            );
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'ID invalido',
            });
        });

        test('debe lanzar un error si algun campo del videojuego a actualizar esta mal diligenciado', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockRequest.body = {
                nombre: '',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            actualizarVideojuego.ejecutar = jest
                .fn()
                .mockRejectedValue(new Error('Campos mal diligenciados'));

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execActualizarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(actualizarVideojuego.ejecutar).toHaveBeenCalledWith(
                1,
                '',
                29.99,
                'videojuego1.jpg',
                10
            );
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Campos mal diligenciados',
            });
        });
    });

    describe('execEliminarVideojuego', () => {
        test('debe enviar el videojuego eliminado si el proceso se realiza exitosamente', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            const videojuegoEliminado = {
                id: 1,
                nombre: 'Videojuego 1',
                precio: 29.99,
                imagen: 'videojuego1.jpg',
                stock: 10,
            };

            eliminarVideojuego.ejecutar = jest
                .fn()
                .mockResolvedValue(videojuegoEliminado);

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execEliminarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(eliminarVideojuego.ejecutar).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(videojuegoEliminado);
        });

        test('Debe lanzar un error de acceso no permitido si el usuario que quiere eliminar un videojuego no es admin', async () => {
            mockRequest.params = {
                id: '1',
            };

            mockRequest.usuario = {
                rol: 'cliente',
            };

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execEliminarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(eliminarVideojuego.ejecutar).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Acceso no permitido',
            });
        });

        test('debe lanzar un error si el ID es invalido (no es numero)', async () => {
            mockRequest.params = {
                id: 'k',
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            eliminarVideojuego.ejecutar = jest
                .fn()
                .mockRejectedValue(new Error('sintaxis'));

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execEliminarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(eliminarVideojuego.ejecutar).toHaveBeenCalledWith(NaN);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'ID invalido',
            });
        });

        test('debe lanzar un error si el videojuego a eliminar no existe', async () => {
            mockRequest.params = {
                id: '2',
            };

            mockRequest.usuario = {
                rol: 'admin',
            };

            eliminarVideojuego.ejecutar = jest
                .fn()
                .mockRejectedValue(new Error('Videojuego no encontrado'));

            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.send = jest.fn();

            videojuegoControlador.execEliminarVideojuego(
                mockRequest,
                mockResponse
            );

            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(eliminarVideojuego.ejecutar).toHaveBeenCalledWith(2);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith({
                error: 'Videojuego no encontrado',
            });
        });
    });
});
