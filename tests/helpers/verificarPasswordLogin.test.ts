import * as bcrypt from 'bcryptjs';
import verificarPasswordLogin from '../../src/helpers/verificarPasswordLogin';

describe('verificarPasswordLogin', () => {
    test('debería devolver true para una contraseña válida', async () => {
        const passwordIngresado = 'password123';
        const passwordAlmacenado = await bcrypt.hash(passwordIngresado, 10);

        const resultado = await verificarPasswordLogin(
            passwordIngresado,
            passwordAlmacenado
        );

        expect(resultado).toBe(true);
    });

    test('debería devolver false para una contraseña inválida', async () => {
        const passwordIngresado = 'incorrectpassword';
        const passwordAlmacenado = await bcrypt.hash('password123', 10);

        const resultado = await verificarPasswordLogin(
            passwordIngresado,
            passwordAlmacenado
        );

        expect(resultado).toBe(false);
    });
});
