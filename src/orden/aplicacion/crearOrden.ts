import { OrdenRepository } from '../dominio/ordenRepository';

export class CrearOrden {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar(
        videojuegos_compradosOrden: Array<{
            id: number;
            cantidad: number;
        }>
    ) {
        const ordenCreada = await this.ordenRepository.crear(
            videojuegos_compradosOrden
        );
        console.log('orden creada');
        return ordenCreada;
    }
}
