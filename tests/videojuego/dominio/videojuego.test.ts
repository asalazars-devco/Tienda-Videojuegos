import { Videojuego } from '../../../src/videojuego/dominio/videojuego';

describe('Videojuego', () => {
    test('debe crear una instancia de Videojuego correctamente', () => {
        const videojuego = new Videojuego(
            1,
            'Ejemplo Juego',
            59.99,
            'ejemplo.png',
            10
        );

        expect(videojuego).toBeInstanceOf(Videojuego);
    });

    test('debe lanzar un error al crear una instancia de Videojuego con valores incorrectos', () => {
        expect(
            () =>
                new Videojuego(
                    '1' as any,
                    'Ejemplo Juego',
                    59.99,
                    'ejemplo.png',
                    10
                )
        ).toThrow('ID tiene que ser de tipo number');

        expect(
            () => new Videojuego(0, 'Ejemplo Juego', 59.99, 'ejemplo.png', 10)
        ).toThrow('ID debe ser mayor de 0');

        expect(() => new Videojuego(1, '', 59.99, 'ejemplo.png', 10)).toThrow(
            'Nombre tiene que ser de tipo string y no puede ser vacio'
        );

        expect(
            () => new Videojuego(1, 'Ejemplo Juego', -10, 'ejemplo.png', 10)
        ).toThrow(
            'Precio tiene que ser de tipo numero y no puede ser menor a 0'
        );

        expect(() => new Videojuego(1, 'Ejemplo Juego', 59.99, '', 10)).toThrow(
            'Imagen tiene que ser de tipo string y no puede ser vacio'
        );

        expect(
            () => new Videojuego(1, 'Ejemplo Juego', 59.99, 'ejemplo.png', -5)
        ).toThrow(
            'Stock tiene que ser de tipo numero y no puede ser menor a 0'
        );
    });
});
