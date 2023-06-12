import express from 'express';
import { usuarioControlador } from './dependencias';
import { autenticacion } from '../../middlewares/autenticacion';

const usuarioRouter = express.Router();

usuarioRouter.get(
    '/',
    usuarioControlador.execObtenerTodosUsuarios.bind(usuarioControlador)
);

usuarioRouter.get(
    '/:id',
    usuarioControlador.execObtenerUsuarioPorId.bind(usuarioControlador)
);

usuarioRouter.post(
    '/',
    usuarioControlador.execCrearUsuario.bind(usuarioControlador)
);

usuarioRouter.post(
    '/admin',
    autenticacion,
    usuarioControlador.execCrearUsuario.bind(usuarioControlador)
);

usuarioRouter.put(
    '/:id',
    autenticacion,
    usuarioControlador.execActualizarUsuario.bind(usuarioControlador)
);

usuarioRouter.delete(
    '/:id',
    autenticacion,
    usuarioControlador.execEliminarUsuario.bind(usuarioControlador)
);

usuarioRouter.post(
    '/login',
    usuarioControlador.execLoginUsuario.bind(usuarioControlador)
);

usuarioRouter.post(
    '/logout',
    autenticacion,
    usuarioControlador.execLogoutUsuario.bind(usuarioControlador)
);

export { usuarioRouter };
