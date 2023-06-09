import jwt from 'jsonwebtoken';
import verificarToken from '../../src/helpers/verificarToken';

describe('verificarToken', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'secret';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    test('debería devolver el contenido decodificado del token válido', () => {
        const payload = {
            id: 1,
            nombre: 'John Doe',
            email: 'johndoe@example.com',
            rol: 'admin',
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!);

        const resultado = verificarToken(token);

        expect(resultado).toHaveProperty('id', 1);
        expect(resultado).toHaveProperty('nombre', 'John Doe');
        expect(resultado).toHaveProperty('email', 'johndoe@example.com');
        expect(resultado).toHaveProperty('rol', 'admin');
    });

    test('debería lanzar un error para un token inválido', () => {
        const token = 'token_invalido';

        expect(() => verificarToken(token)).toThrow('Token invalido');
    });
});

describe('verificarToken utilizando el default_secret para generar los tokens', () => {
    test('debería devolver el contenido decodificado del token válido', () => {
        const payload = {
            id: 1,
            nombre: 'John Doe',
            email: 'johndoe@example.com',
            rol: 'admin',
        };

        const token = jwt.sign(payload, 'default_secret');

        const resultado = verificarToken(token);

        expect(resultado).toHaveProperty('id', 1);
        expect(resultado).toHaveProperty('nombre', 'John Doe');
        expect(resultado).toHaveProperty('email', 'johndoe@example.com');
        expect(resultado).toHaveProperty('rol', 'admin');
    });
});
