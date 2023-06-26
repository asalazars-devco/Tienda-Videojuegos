import validarEmail from '../../../src/helpers/validarEmail';
import validarPassword from '../../../src/helpers/validarPassword';
import encriptarPassword from '../../../src/helpers/encriptarPassword';
import { Usuario, RolUsuario } from '../../../src/usuario/dominio/usuario';

jest.mock('../../../src/helpers/validarEmail');
jest.mock('../../../src/helpers/validarPassword');
jest.mock('../../../src/helpers/encriptarPassword');

describe('Usuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (validarEmail as jest.Mock).mockReturnValue(true);
    });

    describe('constructor', () => {
        test('debe crear una instancia de Usuario con valores validos', () => {
            const nombre = 'John Doe';
            const email = 'johndoe@example.com';
            const rol: RolUsuario = 'cliente';

            const usuario = new Usuario(nombre, email, rol);

            expect(usuario.nombre).toBe(nombre);
            expect(usuario.email).toBe(email);
            expect(usuario.rol).toBe(rol);
        });

        test('debe lanzar un error si el nombre no es un string valido', () => {
            const nombreInvalido = '';
            const email = 'johndoe@example.com';
            const rol: RolUsuario = 'cliente';

            expect(() => new Usuario(nombreInvalido, email, rol)).toThrow(
                'Nombre tiene que ser de tipo string y no puede ser vacio'
            );
        });

        test('debe lanzar un error si el email no es valido', () => {
            const nombre = 'John Doe';
            const emailInvalido = 'emailInvalido';
            const rol: RolUsuario = 'cliente';

            (validarEmail as jest.Mock).mockReturnValue(false);

            expect(() => new Usuario(nombre, emailInvalido, rol)).toThrow(
                'Email invalido'
            );

            expect(validarEmail).toHaveBeenCalledWith(emailInvalido);
        });

        test('debe lanzar un error si el rol no es valido', () => {
            const nombre = 'John Doe';
            const email = 'johndoe@example.com';
            const rolInvalido = 'usuario';

            expect(
                () => new Usuario(nombre, email, rolInvalido as any)
            ).toThrow(
                'Rol de usuario solo puede ser uno de estos tipos: admin o cliente'
            );
        });
    });

    describe('colocarId', () => {
        test('debe asignar un ID valido al usuario', () => {
            const usuario = new Usuario(
                'John Doe',
                'johndoe@example.com',
                'cliente'
            );
            const id = 1;

            usuario.colocarId(id);

            expect(usuario).toHaveProperty('id', id);
        });

        test('debe lanzar un error si se proporciona un ID negativo', () => {
            const usuario = new Usuario(
                'John Doe',
                'johndoe@example.com',
                'cliente'
            );
            const id = -1;

            expect(() => usuario.colocarId(id)).toThrow(
                'ID debe ser mayor de 0'
            );
        });
    });

    describe('colocarPassword', () => {
        test('debe encriptar y asignar una contraseña valida al usuario', async () => {
            const usuario = new Usuario(
                'John Doe',
                'johndoe@example.com',
                'cliente'
            );

            const password = 'password123';
            const passwordEncriptado = 'abc123';

            (validarPassword as jest.Mock).mockReturnValue(true);

            (encriptarPassword as jest.Mock).mockResolvedValue(
                passwordEncriptado
            );

            await usuario.colocarPassword(password);

            expect(validarPassword).toHaveBeenCalledWith(password);
            expect(encriptarPassword).toHaveBeenCalledWith(password);
            expect(usuario).toHaveProperty('password', passwordEncriptado);
        });

        test('debe lanzar un error si la contraseña no cumple con los requisitos', async () => {
            const usuario = new Usuario(
                'John Doe',
                'johndoe@example.com',
                'cliente'
            );
            const password = '12345';

            (validarPassword as jest.Mock).mockReturnValue(false);

            await expect(usuario.colocarPassword(password)).rejects.toThrow(
                'Password debe contener minimo 6 caracteres'
            );

            expect(validarPassword).toHaveBeenCalledWith(password);
            expect(encriptarPassword).not.toHaveBeenCalled();
        });
    });

    describe('obtenerPassword', () => {
        test('debe devolver la contraseña del usuario', () => {
            const usuario = new Usuario(
                'John Doe',
                'johndoe@example.com',
                'cliente'
            );
            const password = 'abc123';
            usuario['password'] = password;

            expect(usuario.obtenerPassword()).toBe(password);
        });
    });
});
