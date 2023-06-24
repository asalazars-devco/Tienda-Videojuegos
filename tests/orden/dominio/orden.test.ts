import { Orden } from '../../../src/orden/dominio/orden';

describe('Orden', () => {
    test('debe crear una instancia Orden de la orden con videojuegos', () => {
        const videojuegosComprados = [
            { id: 1, cantidad: 2 },
            { id: 2, cantidad: 3 },
        ];

        const orden = new Orden(videojuegosComprados);

        expect(orden.videojuegos_comprados).toEqual(videojuegosComprados);
        expect(orden.obtenerCantidad()).toBe(5);
        expect(orden).toBeInstanceOf(Orden);
    });

    test('debe lanzar un error si se intenta crear una orden sin videojuegos', () => {
        const videojuegosComprados: any[] = [];

        expect(() => {
            new Orden(videojuegosComprados);
        }).toThrowError('La orden no puede estar vacia (sin videojuegos)');
    });

    test('debe colocar el ID de la orden', () => {
        const videojuegosComprados = [{ id: 1, cantidad: 2 }];
        const orden = new Orden(videojuegosComprados);

        const idOrden = 1;
        orden.colocarId(idOrden);

        expect(orden['id']).toBe(idOrden);
    });

    test('debe colocar el valor total de la orden', () => {
        const videojuegosComprados = [{ id: 1, cantidad: 2 }];
        const orden = new Orden(videojuegosComprados);

        const valorTotalOrden = 59.99;
        orden.colocarValorTotal(valorTotalOrden);

        expect(orden['valor_total']).toBe(valorTotalOrden);
    });

    test('debe colocar el ID de usuario en la orden', () => {
        const videojuegosComprados = [{ id: 1, cantidad: 2 }];
        const orden = new Orden(videojuegosComprados);

        const idUsuario = 1;
        orden.colocarIdUsuario(idUsuario);

        expect(orden['id_usuario']).toBe(idUsuario);
    });
});
