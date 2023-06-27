import { Pool } from 'pg';
import Database from '../src/postgreSQL_DB';

jest.mock('pg', () => {
    const mockPool = { connect: jest.fn(() => mockClient) };
    const mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: 1, test: 'Test' }] }),
        release: jest.fn(),
    };

    return { Pool: jest.fn(() => mockPool) };
});

describe('Database', () => {
    let mockPool: any;

    beforeAll(() => {
        process.env.DB_USER = 'test_user';
        process.env.DB_HOST = 'test_host';
        process.env.DB_DATABASE = 'test_database';
        process.env.DB_PASSWORD = 'test_password';
        process.env.DB_PORT = 'test_port';
    });

    beforeEach(() => {
        mockPool = new Pool();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInstance', () => {
        test('debe devolver siempre la misma instancia', () => {
            const instancia1 = Database.getInstance();
            const instancia2 = Database.getInstance();

            expect(instancia1).toBe(instancia2);
            expect(instancia1).toBeInstanceOf(Database);
            expect(instancia2).toBeInstanceOf(Database);
        });
    });

    describe('query', () => {
        test('debe ejecutar la consulta y devolver el resultado', async () => {
            const database = Database.getInstance();
            const resultadoEsperado = [{ id: 1, test: 'Test' }];
            const queryPrueba = 'SELECT * FROM tabla_test';
            const resultado = await database.query(queryPrueba);

            expect(mockPool.connect).toBeCalledTimes(1);
            expect(mockPool.connect().query).toBeCalledTimes(1);
            expect(mockPool.connect().query).toHaveBeenCalledWith(
                queryPrueba,
                undefined
            );
            expect(mockPool.connect().release).toBeCalledTimes(1);
            expect(resultado).toEqual(resultadoEsperado);
        });

        test('debe pasar los parametros a la consulta y devolver resultado', async () => {
            const database = Database.getInstance();
            const resultadoEsperado = [{ id: 1, test: 'Test' }];
            const queryPrueba = 'SELECT * FROM tabla_test';
            const parametrosQueryPrueba = [1, 'Test'];

            const resultado = await database.query(
                queryPrueba,
                parametrosQueryPrueba
            );

            expect(mockPool.connect).toBeCalledTimes(1);
            expect(mockPool.connect().query).toBeCalledTimes(1);
            expect(mockPool.connect().query).toHaveBeenCalledWith(
                queryPrueba,
                parametrosQueryPrueba
            );
            expect(mockPool.connect().release).toBeCalledTimes(1);
            expect(resultado).toEqual(resultadoEsperado);
        });
    });
});
