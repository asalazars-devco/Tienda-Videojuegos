import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const generarToken = (usuario: {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: string;
}): string => {
    if (!process.env.JWT_SECRET || !process.env.EXPIRE_TIME) {
        throw new Error(
            'Establece la clave secreta y el tiempo de expiracion para los tokens'
        );
    }

    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
    };

    const options = {
        expiresIn: process.env.EXPIRE_TIME,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
};

export default generarToken;
