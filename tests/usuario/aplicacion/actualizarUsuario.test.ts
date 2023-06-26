import { RolUsuario } from '../../../src/usuario/dominio/usuario';
import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { ActualizarUsuario } from '../../../src/usuario/aplicacion/actualizarUsuario';

describe('ActualizarUsuario', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const actualizarUsuario: ActualizarUsuario = new ActualizarUsuario(
        mockUsuarioRepository
    );

    test('debe llamar al método actualizar del usuarioRepository y devolver el usuario actualizado', async () => {
        const idUsuario = 1;
        const nombreUsuario = 'John Doe';
        const emailUsuario = 'johndoe@example.com';
        const passwordUsuario = 'password123';
        const rolUsuario: RolUsuario = 'cliente';

        const usuarioActualizado = {
            id: idUsuario,
            nombre: nombreUsuario,
            email: emailUsuario,
            rol: rolUsuario,
        };

        mockUsuarioRepository.actualizar = jest
            .fn()
            .mockResolvedValue(usuarioActualizado);

        const resultado = await actualizarUsuario.ejecutar(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );

        expect(mockUsuarioRepository.actualizar).toHaveBeenCalledWith(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );
        expect(resultado).toBe(usuarioActualizado);
    });
});
