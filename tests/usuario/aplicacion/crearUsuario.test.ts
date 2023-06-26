import { RolUsuario } from '../../../src/usuario/dominio/usuario';
import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { CrearUsuario } from '../../../src/usuario/aplicacion/crearUsuario';

describe('CrearUsuario', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const crearUsuario: CrearUsuario = new CrearUsuario(mockUsuarioRepository);

    test('debe llamar al método crear del usuarioRepository y devolver el usuario creado', async () => {
        const idUsuario = 1;
        const nombreUsuario = 'John Doe';
        const emailUsuario = 'johndoe@example.com';
        const passwordUsuario = 'password123';
        const rolUsuario: RolUsuario = 'cliente';

        const usuarioCreado = {
            id: idUsuario,
            nombre: nombreUsuario,
            email: emailUsuario,
            rol: rolUsuario,
        };

        mockUsuarioRepository.crear = jest
            .fn()
            .mockResolvedValue(usuarioCreado);

        const resultado = await crearUsuario.ejecutar(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );

        expect(mockUsuarioRepository.crear).toHaveBeenCalledWith(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );
        expect(resultado).toBe(usuarioCreado);
    });
});
