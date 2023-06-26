import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { LoginUsuario } from '../../../src/usuario/aplicacion/loginUsuario';

describe('LoginUsuario', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const loginUsuario: LoginUsuario = new LoginUsuario(mockUsuarioRepository);

    test('debe llamar al método login del usuarioRepository y devolver el usuario autenticado', async () => {
        const emailUsuario = 'johndoe@example.com';
        const passwordUsuario = 'password123';

        const usuarioAutenticado = {
            nombre: 'John Doe',
            email: emailUsuario,
            rol: 'cliente',
            token: 'token',
        };

        mockUsuarioRepository.login = jest
            .fn()
            .mockResolvedValue(usuarioAutenticado);

        const resultado = await loginUsuario.ejecutar(
            emailUsuario,
            passwordUsuario
        );

        expect(mockUsuarioRepository.login).toHaveBeenCalledWith(
            emailUsuario,
            passwordUsuario
        );
        expect(resultado).toBe(usuarioAutenticado);
    });
});
