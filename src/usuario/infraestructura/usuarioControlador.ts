import { Request, Response } from 'express';

import { ObtenerTodosUsuarios } from '../aplicacion/obtenerTodosUsuarios';
import { ObtenerUsuarioPorId } from '../aplicacion/obtenerUsuarioPorId';
import { CrearUsuario } from '../aplicacion/crearUsuario';
import { ActualizarUsuario } from '../aplicacion/actualizarUsuario';
import { EliminarUsuario } from '../aplicacion/eliminarUsuario';
import { LoginUsuario } from '../aplicacion/loginUsuario';
import { LogoutUsuario } from '../aplicacion/logoutUsuario';

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
        const usuariosTodos = await this.obtenerTodosUsuarios.ejecutar();

        res.status(200).send(usuariosTodos);
    }

    async execObtenerUsuarioPorId(req: Request, res: Response) {
        const idUsuario = req.params.id;

        try {
            const usuario = await this.obtenerUsuarioPorId.ejecutar(
                Number(idUsuario)
            );
            res.status(200).send(usuario);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(404).sendStatus(404);
        }
    }

    async execCrearUsuario(req: Request, res: Response) {
        const { nombre, email, password, rol } = req.body;

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
            res.status(400).sendStatus(400);
        }
    }

    async execActualizarUsuario(req: Request, res: Response) {
        const idUsuario = req.params.id;
        const { nombre, email, password, rol } = req.body;

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
            res.status(400).sendStatus(400);
        }
    }

    async execEliminarUsuario(req: Request, res: Response) {
        const idUsuario = req.params.id;

        try {
            const usuarioEliminado = await this.eliminarUsuario.ejecutar(
                Number(idUsuario)
            );
            res.send(usuarioEliminado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(404).sendStatus(404);
        }
    }

    async execLoginUsuario(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const usuarioAutenticado = await this.loginUsuario.ejecutar(
                email,
                password
            );
            res.send(usuarioAutenticado);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(404).sendStatus(404);
        }
    }

    async execLogoutUsuario(req: Request, res: Response) {
        try {
            const usuarioCerroSesion = await this.logoutUsuario.ejecutar();
            res.setHeader('Limpiar-Token', 'true');
            res.send(usuarioCerroSesion);
        } catch (error: any) {
            console.log('mensaje de Error:', error.message);
            res.status(500).send('Error al cerrar la sesion');
        }
    }
}
