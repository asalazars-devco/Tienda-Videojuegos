import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        // Configuración de la conexión a la base de datos
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query(text: string, values?: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, values);
            return result.rows;
        } finally {
            client.release();
        }
    }
}

export default Database;
