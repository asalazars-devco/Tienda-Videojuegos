export class Orden {
    private id!: number;
    private cantidad: number;
    private valor_total!: number;

    constructor(
        readonly videojuegos_comprados: Array<{
            id: number;
            cantidad: number;
        }>
    ) {
        if (videojuegos_comprados.length === 0) {
            throw new Error('La orden no puede estar vacia (sin videojuegos)');
        }

        this.cantidad = this.obtenerCantidad();
    }

    obtenerCantidad(): number {
        return this.videojuegos_comprados.reduce(
            (acumulado, juegoActual) => acumulado + juegoActual.cantidad,
            0
        );
    }

    colocarId(id: number): void {
        this.id = id;
    }

    colocarValorTotal(valor_total: number): void {
        this.valor_total = valor_total;
    }
}
