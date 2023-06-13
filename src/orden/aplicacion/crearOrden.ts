import { OrdenRepository } from '../dominio/ordenRepository';

export class CrearOrden {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar(
        videojuegos_compradosOrden: Array<{
            id: number;
            cantidad: number;
        }>,
        id_usuario: number | null
    ) {
        const ordenCreada = await this.ordenRepository.crear(
            videojuegos_compradosOrden,
            id_usuario
        );
        console.log('orden creada');
        return ordenCreada;
    }
}
