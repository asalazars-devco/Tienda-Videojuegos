import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { LogoutUsuario } from '../../../src/usuario/aplicacion/logoutUsuario';

describe('LogoutUsuario', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const logoutUsuario: LogoutUsuario = new LogoutUsuario(
        mockUsuarioRepository
    );

    test('debe llamar al método logout del usuarioRepository y devolver el resultado del cierre de sesión', async () => {
        const resultadoCierreSesion = true;

        mockUsuarioRepository.logout = jest
            .fn()
            .mockResolvedValue(resultadoCierreSesion);

        const resultado = await logoutUsuario.ejecutar();

        expect(mockUsuarioRepository.logout).toHaveBeenCalled();
        expect(resultado).toBe(resultadoCierreSesion);
    });
});
