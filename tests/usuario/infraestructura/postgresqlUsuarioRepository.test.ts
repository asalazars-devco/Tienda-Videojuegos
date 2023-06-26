import { Usuario, RolUsuario } from '../../../src/usuario/dominio/usuario';
import { UsuarioRepository } from '../../../src/usuario/dominio/usuarioRepository';
import { PostgresqlUsuarioRepository } from '../../../src/usuario/infraestructura/postgresqlUsuarioRepository';
import Database from '../../../src/postgreSQL_DB';
import verificarPasswordLogin from '../../../src/helpers/verificarPasswordLogin';
import generarToken from '../../../src/helpers/generarToken';
import validarPassword from '../../../src/helpers/validarPassword';
import encriptarPassword from '../../../src/helpers/encriptarPassword';

// Mock de las funciones verificarPasswordLogin y generarToken
jest.mock('../../../src/helpers/verificarPasswordLogin');
jest.mock('../../../src/helpers/generarToken');
jest.mock('../../../src/helpers/validarPassword');
jest.mock('../../../src/helpers/encriptarPassword');

describe('PostgresqlUsuarioRepository', () => {
    let usuarioRepository: UsuarioRepository;
    let databaseMock: jest.Mocked<Database>;

    beforeEach(() => {
        databaseMock = Database.getInstance() as jest.Mocked<Database>;

        usuarioRepository = new PostgresqlUsuarioRepository();
    });

    describe('obtenerTodo', () => {
        test('debe obtener todos los usuarios existentes', async () => {
            const usuariosObtenidos = [
                {
                    id: 1,
                    nombre: 'Usuario 1',
                    email: 'usuario1@mail.com',
                    password: 'password1',
                    rol: 'cliente',
                },
                {
                    id: 2,
                    nombre: 'Usuario 2',
                    email: 'usuario2@mail.com',
                    password: 'password2',
                    rol: 'admin',
                },
            ];

            databaseMock.query = jest.fn().mockResolvedValue(usuariosObtenidos);

            const resultado = await usuarioRepository.obtenerTodo();

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios'
            );

            expect(resultado[0]).toBeInstanceOf(Usuario);
            expect(resultado[0].nombre).toBe(usuariosObtenidos[0].nombre);
            expect(resultado[0].email).toBe(usuariosObtenidos[0].email);
            expect(resultado[0].rol).toBe(usuariosObtenidos[0].rol);
            expect(resultado[0]).toHaveProperty('id', usuariosObtenidos[0].id);

            expect(resultado[1]).toBeInstanceOf(Usuario);
            expect(resultado[1].nombre).toBe(usuariosObtenidos[1].nombre);
            expect(resultado[1].email).toBe(usuariosObtenidos[1].email);
            expect(resultado[1].rol).toBe(usuariosObtenidos[1].rol);
            expect(resultado[1]).toHaveProperty('id', usuariosObtenidos[1].id);
        });
    });

    describe('obtenerPorId', () => {
        test('debe obtener un usuario por su id', async () => {
            const idUsuario = 1;
            const usuarioObtenido = {
                id: 1,
                nombre: 'Usuario 1',
                email: 'usuario1@mail.com',
                password: 'password1',
                rol: 'cliente',
            };

            databaseMock.query = jest.fn().mockResolvedValue([usuarioObtenido]);

            const resultado = await usuarioRepository.obtenerPorId(idUsuario);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios WHERE id = $1',
                [idUsuario]
            );

            expect(resultado).toBeInstanceOf(Usuario);
            expect(resultado.nombre).toBe(usuarioObtenido.nombre);
            expect(resultado.email).toBe(usuarioObtenido.email);
            expect(resultado.rol).toBe(usuarioObtenido.rol);
            expect(resultado).toHaveProperty('id', usuarioObtenido.id);
        });

        test('debe lanzar un error si no se encuentra el usuario', async () => {
            const idUsuario = 1;

            databaseMock.query = jest.fn().mockResolvedValue([]);

            await expect(
                usuarioRepository.obtenerPorId(idUsuario)
            ).rejects.toThrowError('Usuario no encontrado');
        });
    });

    describe('crear', () => {
        test('debe crear un nuevo usuario', async () => {
            const idUsuario = 1;
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = 'usuario1@mail.com';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'cliente';

            const usuarioCreado = {
                id: idUsuario,
                nombre: nombreUsuario,
                email: emailUsuario,
                password: passwordUsuario,
                rol: rolUsuario,
            };

            databaseMock.query = jest.fn().mockResolvedValue([usuarioCreado]);
            (validarPassword as jest.Mock).mockReturnValue(true);
            (encriptarPassword as jest.Mock).mockResolvedValue(passwordUsuario);

            const resultado = await usuarioRepository.crear(
                idUsuario,
                nombreUsuario,
                emailUsuario,
                passwordUsuario,
                rolUsuario
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO usuarios (id, nombre, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    idUsuario,
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario,
                ]
            );

            expect(resultado).toBeInstanceOf(Usuario);
            expect(resultado.nombre).toBe(usuarioCreado.nombre);
            expect(resultado.email).toBe(usuarioCreado.email);
            expect(resultado.rol).toBe(usuarioCreado.rol);
            expect(resultado).toHaveProperty('id', usuarioCreado.id);
        });

        test('debe crear un nuevo usuario si el ID no es especificado', async () => {
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = 'usuario1@mail.com';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'cliente';

            const usuarioCreado = {
                id: 1,
                nombre: nombreUsuario,
                email: emailUsuario,
                password: passwordUsuario,
                rol: rolUsuario,
            };

            databaseMock.query = jest.fn().mockResolvedValue([usuarioCreado]);
            (validarPassword as jest.Mock).mockReturnValue(true);
            (encriptarPassword as jest.Mock).mockResolvedValue(passwordUsuario);

            const resultado = await usuarioRepository.crear(
                null,
                nombreUsuario,
                emailUsuario,
                passwordUsuario,
                rolUsuario
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
                [nombreUsuario, emailUsuario, passwordUsuario, rolUsuario]
            );

            expect(resultado).toBeInstanceOf(Usuario);
            expect(resultado.nombre).toBe(usuarioCreado.nombre);
            expect(resultado.email).toBe(usuarioCreado.email);
            expect(resultado.rol).toBe(usuarioCreado.rol);
            expect(resultado).toHaveProperty('id', usuarioCreado.id);
        });

        test('debe devolver un usuario existente si se intenta crear un nuevo usuario con email ya existente', async () => {
            const usuarioNuevo = {
                nombre: 'Usuario Nuevo 1',
                email: 'usuario1@mail.com',
                password: 'passwordNuevo1',
                rol: 'cliente',
            };

            const usuarioExistente = {
                id: 1,
                nombre: 'Usuario 1',
                email: 'usuario1@mail.com',
                password: 'password1',
                rol: 'cliente',
            };

            databaseMock.query = jest
                .fn()
                .mockRejectedValueOnce(new Error('llave duplicada'))
                .mockResolvedValueOnce([usuarioExistente]);

            const resultado = await usuarioRepository.crear(
                null,
                usuarioNuevo.nombre,
                usuarioNuevo.email,
                usuarioNuevo.password,
                usuarioNuevo.rol as RolUsuario
            );

            expect(resultado).toBeInstanceOf(Usuario);
            expect(resultado.nombre).toBe(usuarioExistente.nombre);
            expect(resultado.email).toBe(usuarioExistente.email);
            expect(resultado.rol).toBe(usuarioExistente.rol);
            expect(resultado).toHaveProperty('id', usuarioExistente.id);

            expect(databaseMock.query).toHaveBeenCalledTimes(2);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios WHERE email = $1',
                [usuarioNuevo.email]
            );
        });

        test('debe lanzar un error si al crear un nuevo usuario no se tiene correctamente la informacion requerida', async () => {
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = 'emailIncorrecto';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'admin';

            await expect(
                usuarioRepository.crear(
                    null,
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario
                )
            ).rejects.toThrowError();
        });
    });

    describe('actualizar', () => {
        test('debe actualizar un usuario existente', async () => {
            const idUsuario = 1;
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = 'usuario1@mail.com';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'cliente';

            const usuarioActualizado = {
                id: idUsuario,
                nombre: nombreUsuario,
                email: emailUsuario,
                rol: rolUsuario,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([usuarioActualizado]);

            const resultado = await usuarioRepository.actualizar(
                idUsuario,
                nombreUsuario,
                emailUsuario,
                passwordUsuario,
                rolUsuario
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'UPDATE usuarios SET nombre = $1, email = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *',
                [
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario,
                    idUsuario,
                ]
            );
            expect(resultado).toEqual(usuarioActualizado);
        });

        test('Si el usuario a actualizar no existe, debe de crear un nuevo usuario con el ID suministrado', async () => {
            const idUsuario = 1;
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = 'usuario1@example.com';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'cliente';

            const usuarioActualizado = {
                id: idUsuario,
                nombre: nombreUsuario,
                email: emailUsuario,
                rol: rolUsuario,
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([usuarioActualizado]);

            const resultado = await usuarioRepository.actualizar(
                idUsuario,
                nombreUsuario,
                emailUsuario,
                passwordUsuario,
                rolUsuario
            );

            expect(databaseMock.query).toHaveBeenCalledTimes(2);
            expect(databaseMock.query).toHaveBeenCalledWith(
                'UPDATE usuarios SET nombre = $1, email = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *',
                [
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario,
                    idUsuario,
                ]
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'INSERT INTO usuarios (id, nombre, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    idUsuario,
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario,
                ]
            );

            expect(resultado).toEqual(usuarioActualizado);
        });

        test('debe lanzar un error si los datos de actualizacion requeridos no se encuentran correctamente diligenciados', async () => {
            const idUsuario = 1;
            const nombreUsuario = 'Usuario 1';
            const emailUsuario = '';
            const passwordUsuario = 'password1';
            const rolUsuario: RolUsuario = 'cliente';

            await expect(
                usuarioRepository.actualizar(
                    idUsuario,
                    nombreUsuario,
                    emailUsuario,
                    passwordUsuario,
                    rolUsuario
                )
            ).rejects.toThrowError();
        });
    });

    describe('eliminar', () => {
        test('debe eliminar el usuario', async () => {
            const idUsuario = 1;
            const usuarioExistente = {
                id: 1,
                nombre: 'Usuario 1',
                email: 'usuario1@mail.com',
                password: 'password1',
                rol: 'cliente',
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([usuarioExistente]);

            const resultado = await usuarioRepository.eliminar(idUsuario);

            expect(databaseMock.query).toHaveBeenCalledWith(
                'DELETE FROM usuarios WHERE id = $1 RETURNING *',
                [idUsuario]
            );

            expect(resultado).toBeInstanceOf(Usuario);
            expect(resultado.nombre).toBe(usuarioExistente.nombre);
            expect(resultado.email).toBe(usuarioExistente.email);
            expect(resultado.rol).toBe(usuarioExistente.rol);
            expect(resultado).toHaveProperty('id', usuarioExistente.id);
        });

        test('debe lanzar un error si el usuario no es encontrado', async () => {
            const idUsuario = 1;

            databaseMock.query = jest.fn().mockResolvedValue([]);

            await expect(usuarioRepository.eliminar(idUsuario)).rejects.toThrow(
                'Usuario no encontrado'
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'DELETE FROM usuarios WHERE id = $1 RETURNING *',
                [idUsuario]
            );
        });
    });

    describe('login', () => {
        test('debe autenticar al usuario si las credenciales son validas', async () => {
            const emailUsuario = 'usuario1@mail.com';
            const passwordUsuario = 'password1';

            const usuarioAlmacenado = {
                id: 1,
                nombre: 'Usuario 1',
                email: emailUsuario,
                password: 'password1',
                rol: 'cliente',
            };

            const usuarioAutenticado = {
                nombre: 'Usuario 1',
                email: emailUsuario,
                rol: 'cliente',
                token: 'token',
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([usuarioAlmacenado]);

            (verificarPasswordLogin as jest.Mock).mockReturnValue(true);
            (generarToken as jest.Mock).mockReturnValue('token');

            const resultado = await usuarioRepository.login(
                emailUsuario,
                passwordUsuario
            );

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios WHERE email = $1',
                [emailUsuario]
            );

            expect(verificarPasswordLogin).toHaveBeenCalledWith(
                passwordUsuario,
                usuarioAlmacenado.password
            );

            expect(generarToken).toHaveBeenCalledWith(usuarioAlmacenado);
            expect(resultado).toEqual(usuarioAutenticado);
        });

        test('debe lanzar un error si las credenciales no son suministradas', async () => {
            const emailUsuario = null;
            const passwordUsuario = 'password1';

            await expect(
                usuarioRepository.login(emailUsuario as any, passwordUsuario)
            ).rejects.toThrowError('Credenciales no suministradas');
        });

        test('debe lanzar un error si el email no es valido', async () => {
            const emailUsuario = 'emailIncorrecto';
            const passwordUsuario = 'password1';

            databaseMock.query = jest.fn().mockResolvedValue([]);

            await expect(
                usuarioRepository.login(emailUsuario, passwordUsuario)
            ).rejects.toThrowError('Credenciales invalidas');

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios WHERE email = $1',
                [emailUsuario]
            );
        });

        test('debe lanzar un error si el password no es valido', async () => {
            const emailUsuario = 'usuario1@mail.com';
            const passwordUsuario = 'passwordIncorrecto';

            const usuarioAlmacenado = {
                id: 1,
                nombre: 'Usuario 1',
                email: emailUsuario,
                password: 'password1',
                rol: 'cliente',
            };

            databaseMock.query = jest
                .fn()
                .mockResolvedValue([usuarioAlmacenado]);

            (verificarPasswordLogin as jest.Mock).mockReturnValue(false);

            await expect(
                usuarioRepository.login(emailUsuario, passwordUsuario)
            ).rejects.toThrowError('Credenciales invalidas');

            expect(databaseMock.query).toHaveBeenCalledWith(
                'SELECT * FROM usuarios WHERE email = $1',
                [emailUsuario]
            );
        });
    });

    describe('logout', () => {
        test('debe devolver un mensaje de éxito al cerrar sesión', async () => {
            const resultado = await usuarioRepository.logout();

            expect(resultado).toBe('Sesion cerrada exitosamente');
        });
    });
});
