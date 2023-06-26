import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { ObtenerTodosUsuarios } from '../../../src/usuario/aplicacion/obtenerTodosUsuarios';

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

    const obtenerTodosUsuarios: ObtenerTodosUsuarios = new ObtenerTodosUsuarios(
        mockUsuarioRepository
    );

    test('debe llamar al método obtenerTodo del usuarioRepository y devolver los usuarios obtenidos', async () => {
        const usuariosObtenidos = [
            {
                id: 1,
                nombre: 'Usuario 1',
                email: 'usuario1@mail.com',
                rol: 'admin',
            },
            {
                id: 2,
                nombre: 'Usuario 2',
                email: 'usuario2@mail.com',
                rol: 'cliente',
            },
        ];

        mockUsuarioRepository.obtenerTodo = jest
            .fn()
            .mockResolvedValue(usuariosObtenidos);

        const resultado = await obtenerTodosUsuarios.ejecutar();

        expect(mockUsuarioRepository.obtenerTodo).toHaveBeenCalled();
        expect(resultado).toEqual(usuariosObtenidos);
    });
});
