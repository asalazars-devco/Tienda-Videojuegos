import express from 'express';
import { usuarioControlador } from './dependencias';

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

usuarioRouter.put(
    '/:id',
    usuarioControlador.execActualizarUsuario.bind(usuarioControlador)
);

usuarioRouter.delete(
    '/:id',
    usuarioControlador.execEliminarUsuario.bind(usuarioControlador)
);

usuarioRouter.post(
    '/login',
    usuarioControlador.execLoginUsuario.bind(usuarioControlador)
);

usuarioRouter.post(
    '/logout',
    usuarioControlador.execLogoutUsuario.bind(usuarioControlador)
);

export { usuarioRouter };
