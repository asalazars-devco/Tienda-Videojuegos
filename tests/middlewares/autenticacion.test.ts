import { autenticacion } from '../../src/middlewares/autenticacion';
import { NextFunction, Request, Response } from 'express';
import verificarToken from '../../src/helpers/verificarToken';

interface AuthRequest extends Request {
    usuario?: any;
}

const requestMock = {} as AuthRequest;
const responseMock = {} as Response;
const nextMock = {} as NextFunction;

jest.mock('../../src/helpers/verificarToken');

const verificarTokenMock = verificarToken as jest.MockedFunction<
    typeof verificarToken
>;

describe('autenticacion', () => {
    beforeEach(() => {
        requestMock.headers = {};
        responseMock.status = jest.fn().mockReturnThis();
        responseMock.send = jest.fn();
        verificarTokenMock.mockReset();
        requestMock.usuario = undefined;
    });

    test('debe asignar los datos del token al objeto request si se proporcionan los headers de autorización con un token correcto', () => {
        const token = 'exampleToken';
        const tokenData = {
            id: 1,
            nombre: 'Usuario',
            email: 'usuario@mail.com',
            rol: 'cliente',
        };

        requestMock.headers.authorization = `Bearer ${token}`;
        verificarTokenMock.mockReturnValue(tokenData);

        autenticacion(requestMock, responseMock, nextMock);

        expect(verificarTokenMock).toHaveBeenCalledWith(token);
        expect(requestMock.usuario).toEqual(tokenData);
    });

    test('debe lanzar un error de acceso no autorizado si no se proporcionan los headers de autorización', () => {
        autenticacion(requestMock, responseMock, nextMock);

        expect(responseMock.status).toHaveBeenCalledWith(401);
        expect(responseMock.send).toHaveBeenCalledWith({
            error: 'Acceso no autorizado',
        });
    });

    test('debe lanzar un error de acceso no autorizado si el token no es valido', () => {
        const token = 'exampleToken';
        const errorMock = new Error('Error de token');

        requestMock.headers.authorization = `Bearer ${token}`;
        verificarTokenMock.mockImplementation(() => {
            throw errorMock;
        });

        autenticacion(requestMock, responseMock, jest.fn());

        expect(verificarTokenMock).toHaveBeenCalledWith(token);
        expect(requestMock.usuario).toBeUndefined();
        expect(responseMock.status).toHaveBeenCalledWith(401);
        expect(responseMock.send).toHaveBeenCalledWith({
            error: 'Acceso no autorizado',
        });
    });
});
