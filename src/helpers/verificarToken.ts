import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const verificarToken = (token: string) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ?? 'default_secret'
        );
        if (typeof decoded !== 'string') {
            return decoded;
        }
    } catch (error) {
        throw new Error('Token invalido');
    }
};

export default verificarToken;
