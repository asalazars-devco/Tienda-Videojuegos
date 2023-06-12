import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verificarToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET!);
        if (typeof decoded !== 'string') {
            return decoded;
        }
    } catch (error) {
        throw new Error('Token invalido');
    }
};

export default verificarToken;
