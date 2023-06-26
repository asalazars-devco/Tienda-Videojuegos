import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { ObtenerUsuarioPorId } from '../../../src/usuario/aplicacion/obtenerUsuarioPorId';

describe('ObtenerTodosUsuarios', () => {
    const mockUsuarioRepository: UsuarioRepository = {
        obtenerTodo: jest.fn(),
        obtenerPorId: jest.fn(),
        actualizar: jest.fn(),
        crear: jest.fn(),
        eliminar: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    };

    const obtenerUsuarioPorId: ObtenerUsuarioPorId = new ObtenerUsuarioPorId(
        mockUsuarioRepository
    );

    test('debe llamar al método obtenerPorId del usuarioRepository y devolver el usuario obtenido', async () => {
        const usuarioObtenido = [
            {
                id: 1,
                nombre: 'Usuario 1',
                email: 'usuario1@mail.com',
                rol: 'cliente',
            },
        ];
        const idUsuario = 1;

        mockUsuarioRepository.obtenerPorId = jest
            .fn()
            .mockResolvedValue(usuarioObtenido);

        const resultado = await obtenerUsuarioPorId.ejecutar(idUsuario);

        expect(mockUsuarioRepository.obtenerPorId).toHaveBeenCalledWith(
            idUsuario
        );
        expect(resultado).toEqual(usuarioObtenido);
    });
});
