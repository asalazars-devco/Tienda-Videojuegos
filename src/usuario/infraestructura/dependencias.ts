import { ObtenerTodosUsuarios } from '../aplicacion/obtenerTodosUsuarios';
import { ObtenerUsuarioPorId } from '../aplicacion/obtenerUsuarioPorId';
import { CrearUsuario } from '../aplicacion/crearUsuario';
import { ActualizarUsuario } from '../aplicacion/actualizarUsuario';
import { EliminarUsuario } from '../aplicacion/eliminarUsuario';
import { LoginUsuario } from '../aplicacion/loginUsuario';
import { LogoutUsuario } from '../aplicacion/logoutUsuario';

import { PostgresqlUsuarioRepository } from './postgresqlUsuarioRepository';
import { UsuarioControlador } from './usuarioControlador';

const postgresqlUsuarioRepository = new PostgresqlUsuarioRepository();

const obtenerTodosUsuarios = new ObtenerTodosUsuarios(
    postgresqlUsuarioRepository
);

const obtenerUsuarioPorId = new ObtenerUsuarioPorId(
    postgresqlUsuarioRepository
);

const crearUsuario = new CrearUsuario(postgresqlUsuarioRepository);

const actualizarUsuario = new ActualizarUsuario(postgresqlUsuarioRepository);

const eliminarUsuario = new EliminarUsuario(postgresqlUsuarioRepository);

const loginUsuario = new LoginUsuario(postgresqlUsuarioRepository);

const logoutUsuario = new LogoutUsuario(postgresqlUsuarioRepository);

export const usuarioControlador = new UsuarioControlador(
    obtenerTodosUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    logoutUsuario
);
