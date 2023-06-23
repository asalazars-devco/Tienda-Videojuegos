import { OrdenRepository } from '../dominio/ordenRepository';

export class ObtenerTodasOrdenes {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar() {
        const ordenesTodas = await this.ordenRepository.obtenerTodo();

        return ordenesTodas;
    }
}
