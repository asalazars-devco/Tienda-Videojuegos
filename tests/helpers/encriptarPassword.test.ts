import * as bcrypt from 'bcryptjs';
import encriptarPassword from '../../src/helpers/encriptarPassword';

// Mock manual para bcrypt.hash
jest.mock('bcryptjs', () => ({
    hash: jest
        .fn()
        .mockImplementation((password: string) =>
            Promise.resolve(`hashed_${password}`)
        ),
}));

describe('encriptarPassword', () => {
    test('debería encriptar la contraseña correctamente', async () => {
        const password = 'myPassword';
        const saltRounds = 10;
        const passwordEncriptadoEsperado = `hashed_${password}`;

        const passwordEncriptado = await encriptarPassword(password);

        expect(bcrypt.hash).toHaveBeenCalledWith(password, saltRounds);
        expect(passwordEncriptado).toBe(passwordEncriptadoEsperado);
    });
});
