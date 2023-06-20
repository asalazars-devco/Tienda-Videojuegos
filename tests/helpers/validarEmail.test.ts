import validarEmail from '../../src/helpers/validarEmail';

describe('validarEmail', () => {
    test('debería devolver true para un email válido', () => {
        const email = 'test@example.com';
        const resultado = validarEmail(email);
        expect(resultado).toBe(true);
    });

    test('debería devolver false para un email inválido', () => {
        const email = 'invalidemail';
        const resultado = validarEmail(email);
        expect(resultado).toBe(false);
    });
});
