import validarPassword from '../../src/helpers/validarPassword';

describe('validarEmail', () => {
    test('debería devolver true para un password válido', () => {
        const password = '123456';
        const resultado = validarPassword(password);
        expect(resultado).toBe(true);
    });

    test('debería devolver false para un password inválido', () => {
        const password = '123';
        const resultado = validarPassword(password);
        expect(resultado).toBe(false);
    });
});
