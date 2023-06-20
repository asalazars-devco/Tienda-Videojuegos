import * as jwt from 'jsonwebtoken';
import generarToken from '../../src/helpers/generarToken';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('fakeToken'),
}));

describe('generarToken', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'secret';
        process.env.EXPIRE_TIME = '1h';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
        delete process.env.EXPIRE_TIME;
    });

    test('debería generar un token correctamente', () => {
        const usuario = {
            id: 1,
            nombre: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            rol: 'admin',
        };

        const token = generarToken(usuario);

        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.EXPIRE_TIME }
        );
        expect(token).toBe('fakeToken');
    });

    test('debería lanzar un error si no se ha configurado la clave secreta y el tiempo de expiración', () => {
        delete process.env.JWT_SECRET;
        delete process.env.EXPIRE_TIME;

        expect(() => {
            generarToken({
                id: 1,
                nombre: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                rol: 'admin',
            });
        }).toThrowError(
            'Establece la clave secreta y el tiempo de expiracion para los tokens'
        );
    });
});
