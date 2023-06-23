import { OrdenRepository } from '../dominio/ordenRepository';

export class EliminarOrden {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar(idOrden: number) {
        const orden = await this.ordenRepository.eliminar(idOrden);

        if (!orden) {
            throw new Error(`Orden no encontrada`);
        }

        return orden;
    }
}
