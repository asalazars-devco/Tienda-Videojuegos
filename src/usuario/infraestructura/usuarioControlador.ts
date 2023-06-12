import { Request, Response } from 'express';

import { ObtenerTodosUsuarios } from '../aplicacion/obtenerTodosUsuarios';
import { ObtenerUsuarioPorId } from '../aplicacion/obtenerUsuarioPorId';
import { CrearUsuario } from '../aplicacion/crearUsuario';
import { ActualizarUsuario } from '../aplicacion/actualizarUsuario';
import { EliminarUsuario } from '../aplicacion/eliminarUsuario';
import { LoginUsuario } from '../aplicacion/loginUsuario';
import { LogoutUsuario } from '../aplicacion/logoutUsuario';

import esAdmin from '../../helpers/esAdmin';

export class UsuarioControlador {
    constructor(
        private readonly obtenerTodosUsuarios: ObtenerTodosUsuarios,
        private readonly obtenerUsuarioPorId: ObtenerUsuarioPorId,
        private readonly crearUsuario: CrearUsuario,
        private readonly actualizarUsuario: ActualizarUsuario,
        private readonly eliminarUsuario: EliminarUsuario,
        private readonly loginUsuario: LoginUsuario,
        private readonly logoutUsuario: LogoutUsuario
    ) {}

    async execObtenerTodosUsuarios(req: Request, res: Response) {
        try {
            const usuariosTodos = await this.obtenerTodosUsuarios.ejecutar();
            res.status(200).send(usuariosTodos);
        } catch (error) {
            res.status(500).send({
                error: 'Error al cargar los usuarios',
            });
        }
    }

    async execObtenerUsuarioPorId(req: Request, res: Response) {
        const idUsuario = req.params.id;

        try {
            const usuario = await this.obtenerUsuarioPorId.ejecutar(
                Number(idUsuario)
            );
            res.status(200).send(usuario);
        } catch (error: any) {
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }

    async execCrearUsuario(req: Request, res: Response) {
        const { nombre, email, password, rol } = req.body;

        const usuarioPeticionEsAdmin = esAdmin(req.usuario?.rol);

        if (rol === 'admin' && !usuarioPeticionEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const usuarioNuevo = await this.crearUsuario.ejecutar(
                null,
                nombre,
                email,
                password,
                rol
            );

            res.status(201).send(usuarioNuevo);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(400).send({ error: error.message });
        }
    }

    async execActualizarUsuario(req: Request, res: Response) {
        const idUsuario = req.params.id;
        const { nombre, email, password, rol } = req.body;

        const idUsuarioPeticionIdUsuarioActualizadoEsIgual =
            Number(idUsuario) === req.usuario?.id;

        if (!idUsuarioPeticionIdUsuarioActualizadoEsIgual || rol === 'admin') {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const usuarioActualizado = await this.actualizarUsuario.ejecutar(
                Number(idUsuario),
                nombre,
                email,
                password,
                rol
            );

            res.status(201).send(usuarioActualizado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(400).send({ error: error.message });
        }
    }

    async execEliminarUsuario(req: Request, res: Response) {
        const idUsuario = req.params.id;

        const usuarioPeticionEsAdmin = esAdmin(req.usuario?.rol);
        const idUsuarioPeticionIdUsuarioActualizadoEsIgual =
            Number(idUsuario) === req.usuario?.id;

        if (
            !idUsuarioPeticionIdUsuarioActualizadoEsIgual &&
            !usuarioPeticionEsAdmin
        ) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        try {
            const usuarioEliminado = await this.eliminarUsuario.ejecutar(
                Number(idUsuario)
            );
            res.status(200).send(usuarioEliminado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            if (error.message.includes('sintaxis')) {
                res.status(400).send({ error: 'ID invalido' });
            } else {
                res.status(404).send({ error: error.message });
            }
        }
    }

    async execLoginUsuario(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const usuarioAutenticado = await this.loginUsuario.ejecutar(
                email,
                password
            );
            res.status(200).send(usuarioAutenticado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            if (error.message.includes('Credenciales no suministradas')) {
                res.status(400).send({ error: error.message });
            } else {
                res.status(401).send({ error: error.message });
            }
        }
    }

    async execLogoutUsuario(req: Request, res: Response) {
        try {
            const usuarioCerroSesion = await this.logoutUsuario.ejecutar();
            res.setHeader('Limpiar-Token', 'true');
            res.status(200).send(usuarioCerroSesion);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(500).send({ error: 'Error al cerrar la sesion' });
        }
    }
}
