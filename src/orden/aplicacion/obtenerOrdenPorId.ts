import { OrdenRepository } from '../dominio/ordenRepository';

export class ObtenerOrdenPorId {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar(idOrden: number) {
        const orden = await this.ordenRepository.obtenerPorId(idOrden);

        if (!orden) {
            throw new Error(`Orden no encontrada`);
        }

        return orden;
    }
}
