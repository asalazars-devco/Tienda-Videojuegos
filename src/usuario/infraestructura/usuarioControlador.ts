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

    execObtenerTodosUsuarios(req: Request, res: Response) {
        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.obtenerTodosUsuarios
            .ejecutar()
            .then((usuariosTodos) => res.status(200).send(usuariosTodos))
            .catch(() =>
                res.status(500).send({
                    error: 'Error al cargar los usuarios',
                })
            );
    }

    execObtenerUsuarioPorId(req: Request, res: Response) {
        const idUsuario = req.params.id;

        const usuarioEsAdmin = esAdmin(req.usuario?.rol);

        if (!usuarioEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.obtenerUsuarioPorId
            .ejecutar(Number(idUsuario))
            .then((usuario) => res.status(200).send(usuario))
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }

    execCrearUsuario(req: Request, res: Response) {
        const { nombre, email, password, rol } = req.body;

        const usuarioPeticionEsAdmin = esAdmin(req.usuario?.rol);

        if (rol === 'admin' && !usuarioPeticionEsAdmin) {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.crearUsuario
            .ejecutar(null, nombre, email, password, rol)
            .then((usuarioNuevo) => {
                res.set('Content-Type', 'text/plain');
                res.status(201).send(usuarioNuevo);
            })
            .catch((error) => res.status(400).send({ error: error.message }));
    }

    execActualizarUsuario(req: Request, res: Response) {
        const idUsuario = req.params.id;
        const { nombre, email, password, rol } = req.body;

        const idUsuarioPeticionIdUsuarioActualizadoEsIgual =
            Number(idUsuario) === req.usuario?.id;

        if (!idUsuarioPeticionIdUsuarioActualizadoEsIgual || rol === 'admin') {
            return res.status(403).send({ error: 'Acceso no permitido' });
        }

        this.actualizarUsuario
            .ejecutar(Number(idUsuario), nombre, email, password, rol)
            .then((usuarioActualizado) => {
                res.set('Content-Type', 'text/plain');
                res.status(201).send(usuarioActualizado);
            })
            .catch((error) => res.status(400).send({ error: error.message }));
    }

    execEliminarUsuario(req: Request, res: Response) {
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

        this.eliminarUsuario
            .ejecutar(Number(idUsuario))
            .then((usuarioEliminado) => res.status(200).send(usuarioEliminado))
            .catch((error) => {
                if (error.message.includes('sintaxis')) {
                    res.status(400).send({ error: 'ID invalido' });
                } else {
                    res.status(404).send({ error: error.message });
                }
            });
    }

    execLoginUsuario(req: Request, res: Response) {
        const { email, password } = req.body;

        this.loginUsuario
            .ejecutar(email, password)
            .then((usuarioAutenticado) =>
                res.status(200).send(usuarioAutenticado)
            )
            .catch((error) => {
                if (error.message.includes('Credenciales no suministradas')) {
                    res.status(400).send({ error: error.message });
                } else {
                    res.status(401).send({ error: error.message });
                }
            });
    }

    execLogoutUsuario(req: Request, res: Response) {
        this.logoutUsuario
            .ejecutar()
            .then((usuarioCerroSesion) => {
                res.setHeader('Limpiar-Token', 'true');
                res.status(200).send(usuarioCerroSesion);
            })
            .catch(() =>
                res.status(500).send({ error: 'Error al cerrar la sesion' })
            );
    }
}
