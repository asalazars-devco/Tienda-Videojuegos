import esAdmin from '../../src/helpers/esAdmin';

describe('esAdmin', () => {
    test('debería devolver true si el rol es "admin"', () => {
        const requestUsuarioRol = 'admin';
        const resultado = esAdmin(requestUsuarioRol);
        expect(resultado).toBe(true);
    });

    test('debería devolver false si el rol no es "admin"', () => {
        const requestUsuarioRol = 'cliente';
        const resultado = esAdmin(requestUsuarioRol);
        expect(resultado).toBe(false);
    });
});
