import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { EliminarUsuario } from '../../../src/usuario/aplicacion/eliminarUsuario';

describe('EliminarUsuario', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const eliminarUsuario: EliminarUsuario = new EliminarUsuario(
        mockUsuarioRepository
    );

    test('debe llamar al método eliminar del usuarioRepository y devolver el usuario eliminado', async () => {
        const idUsuario = 1;
        const usuarioEliminado = {
            id: idUsuario,
            nombre: 'John Doe',
            email: 'johndoe@example.com',
            rol: 'cliente',
        };

        mockUsuarioRepository.eliminar = jest
            .fn()
            .mockResolvedValue(usuarioEliminado);

        const resultado = await eliminarUsuario.ejecutar(idUsuario);

        expect(mockUsuarioRepository.eliminar).toHaveBeenCalledWith(idUsuario);
        expect(resultado).toBe(usuarioEliminado);
    });
});
