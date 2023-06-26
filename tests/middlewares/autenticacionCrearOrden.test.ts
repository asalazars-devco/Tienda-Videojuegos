import { autenticacionCrearOrden } from '../../src/middlewares/autenticacionCrearOrden';
import { Request, Response, NextFunction } from 'express';
import verificarToken from '../../src/helpers/verificarToken';

interface AuthRequest extends Request {
    usuario?: any;
}

jest.mock('../../src/helpers/verificarToken');

describe('autenticacionCrearOrden', () => {
    let requestMock: Partial<AuthRequest>;
    let responseMock: Partial<Response>;
    let nextMock: jest.Mocked<NextFunction>;

    beforeEach(() => {
        requestMock = {};
        responseMock = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        nextMock = jest.fn();
        requestMock.headers = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe asignar los datos del token al objeto request si se proporcionan los headers de autorización con un token correcto', () => {
        const tokenData = {
            id: 1,
            nombre: 'Usuario',
            email: 'usuario@mail.com',
            rol: 'cliente',
        };

        (verificarToken as jest.Mock).mockReturnValue(tokenData);

        const token = 'token';
        requestMock.headers = { authorization: `Bearer ${token}` };

        autenticacionCrearOrden(
            requestMock as Request,
            responseMock as Response,
            nextMock
        );

        expect(verificarToken).toHaveBeenCalledTimes(1);
        expect(verificarToken).toHaveBeenCalledWith(token);

        expect(requestMock.usuario).toBe(tokenData);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(responseMock.status).not.toHaveBeenCalled();
        expect(responseMock.send).not.toHaveBeenCalled();
    });

    test('debe llamar a next si no se proporciona los headers de autorización', () => {
        autenticacionCrearOrden(
            requestMock as Request,
            responseMock as Response,
            nextMock
        );

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(responseMock.status).not.toHaveBeenCalled();
        expect(responseMock.send).not.toHaveBeenCalled();
    });

    test('debe lanzar un error de acceso no autorizado si el token no es valido', () => {
        const errorMessage = 'Token invalido';

        (verificarToken as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });

        const token = 'token';
        requestMock.headers = { authorization: `Bearer ${token}` };

        autenticacionCrearOrden(
            requestMock as Request,
            responseMock as Response,
            nextMock
        );

        expect(verificarToken).toHaveBeenCalledTimes(1);
        expect(verificarToken).toHaveBeenCalledWith(token);

        expect(requestMock.usuario).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(401);
        expect(responseMock.send).toHaveBeenCalledWith({
            error: 'Acceso no autorizado',
        });
    });
});
