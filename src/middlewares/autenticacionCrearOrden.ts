import { Request, Response, NextFunction } from 'express';
import verificarToken from '../helpers/verificarToken';

export const autenticacionCrearOrden = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const autorizacionHeaders = req.headers.authorization;

    if (autorizacionHeaders === undefined) {
        next();
    } else {
        try {
            const token = autorizacionHeaders.split(' ')[1];
            const tokenData = verificarToken(token);
            req.usuario = tokenData;
            next();
        } catch (error) {
            return res.status(401).send({ error: 'Acceso no autorizado' });
        }
    }
};
