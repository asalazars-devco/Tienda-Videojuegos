import { OrdenRepository } from '../dominio/ordenRepository';

export class EliminarOrden {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar(idOrden: number) {
        const orden = await this.ordenRepository.eliminar(idOrden);

        if (!orden) {
            throw new Error(`No existe orden con ID: ${idOrden}`);
        }

        console.log('orden eliminada');
        return orden;
    }
}