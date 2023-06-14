import { Usuario, RolUsuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuarioRepository';

import Database from '../../postgreSQL_DB';

import verificarPasswordLogin from '../../helpers/verificarPasswordLogin';
import generarToken from '../../helpers/generarToken';

const database = Database.getInstance();

export class PostgresqlUsuarioRepository implements UsuarioRepository {
    async obtenerTodo(): Promise<[] | Usuario[]> {
        const query = 'SELECT * FROM usuarios';
        const usuarios = await database.query(query);

        return usuarios.map(
            (usuario: {
                id: number;
                nombre: string;
                email: string;
                password: string;
                rol: RolUsuario;
            }) => {
                const usuarioObtenido = new Usuario(
                    usuario.nombre,
                    usuario.email,
                    usuario.rol
                );
                usuarioObtenido.colocarId(usuario.id);
                return usuarioObtenido;
            }
        );
    }

    async obtenerPorId(idUsuario: number): Promise<Usuario> {
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const values = [idUsuario];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            throw new Error(`Usuario no encontrado`);
        } else {
            const usuario = resultado[0];
            const usuarioObtenido = new Usuario(
                usuario.nombre,
                usuario.email,
                usuario.rol
            );
            usuarioObtenido.colocarId(usuario.id);
            return usuarioObtenido;
        }
    }

    async crear(
        idUsuario: number | null,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ): Promise<Usuario> {
        try {
            const usuarioCreado = new Usuario(
                nombreUsuario,
                emailUsuario,
                rolUsuario
            );

            await usuarioCreado.colocarPassword(passwordUsuario);

            let query;
            let values;

            if (idUsuario) {
                query =
                    'INSERT INTO usuarios (id, nombre, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *';
                values = [
                    idUsuario,
                    nombreUsuario,
                    emailUsuario,
                    usuarioCreado.obtenerPassword(),
                    rolUsuario,
                ];
            } else {
                query =
                    'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *';
                values = [
                    nombreUsuario,
                    emailUsuario,
                    usuarioCreado.obtenerPassword(),
                    rolUsuario,
                ];
            }
            const resultado = await database.query(query, values);

            const usuario = resultado[0];
            usuarioCreado.colocarId(usuario.id);

            const usuarioCreadoResponse = new Usuario(
                nombreUsuario,
                emailUsuario,
                rolUsuario
            );
            usuarioCreadoResponse.colocarId(usuario.id);

            return usuarioCreadoResponse;
        } catch (error: any) {
            if (error.message.includes('llave duplicada')) {
                const query = 'SELECT * FROM usuarios WHERE email = $1';
                const values = [emailUsuario];

                const resultado = await database.query(query, values);
                const usuario = resultado[0];

                const usuarioCreado = new Usuario(
                    usuario.nombre,
                    usuario.email,
                    usuario.rol
                );
                usuarioCreado.colocarId(usuario.id);

                return usuarioCreado;
            }

            throw new Error(error.message);
        }
    }

    async actualizar(
        idUsuario: number,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ): Promise<Usuario> {
        try {
            const usuarioActualizado = new Usuario(
                nombreUsuario,
                emailUsuario,
                rolUsuario
            );

            await usuarioActualizado.colocarPassword(passwordUsuario);

            const query =
                'UPDATE usuarios SET nombre = $1, email = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *';
            const values = [
                nombreUsuario,
                emailUsuario,
                usuarioActualizado.obtenerPassword(),
                rolUsuario,
                idUsuario,
            ];

            const resultado = await database.query(query, values);

            if (resultado.length === 0) {
                console.log(
                    `ID ${idUsuario} no encontrado en la base de datos`
                );
                console.log('Se crea el usuario');
                return this.crear(
                    idUsuario,
                    nombreUsuario,
                    emailUsuario,
                    usuarioActualizado.obtenerPassword(),
                    rolUsuario
                );
            } else {
                const usuarioActualizadoResponse = new Usuario(
                    nombreUsuario,
                    emailUsuario,
                    rolUsuario
                );
                usuarioActualizadoResponse.colocarId(idUsuario);
                return usuarioActualizadoResponse;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async eliminar(idUsuario: number): Promise<Usuario> {
        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
        const values = [idUsuario];

        const resultado = await database.query(query, values);

        if (resultado.length === 0) {
            throw new Error(`Usuario no encontrado`);
        } else {
            const usuario = resultado[0];
            const usuarioEliminado = new Usuario(
                usuario.nombre,
                usuario.email,
                usuario.rol
            );
            usuarioEliminado.colocarId(usuario.id);
            return usuarioEliminado;
        }
    }

    async login(
        emailUsuario: string,
        passwordUsuario: string
    ): Promise<{
        nombre: string;
        email: string;
        rol: RolUsuario;
        token: string;
    }> {
        if (!emailUsuario || !passwordUsuario) {
            throw new Error('Credenciales no suministradas');
        }

        const resultado = await database.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [emailUsuario]
        );

        if (resultado.length === 0) {
            throw new Error('Credenciales invalidas');
        }

        const usuario = resultado[0];

        // Hot fix Usuario admin inicial
        if (emailUsuario === 'admin@mail.com') {
            const token = generarToken(usuario);
            return {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                token: token,
            };
        }

        const esPasswordCorrecto = await verificarPasswordLogin(
            passwordUsuario,
            usuario.password
        );

        if (esPasswordCorrecto) {
            const token = generarToken(usuario);
            return {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                token: token,
            };
        } else {
            throw new Error('Credenciales invalidas');
        }
    }

    async logout(): Promise<string> {
        const mensajeCerrarSesion = 'Sesion cerrada exitosamente';
        return mensajeCerrarSesion;
    }
}
