import { OrdenRepository } from '../dominio/ordenRepository';

export class ObtenerTodasOrdenes {
    constructor(private readonly ordenRepository: OrdenRepository) {}

    async ejecutar() {
        const ordenesTodas = await this.ordenRepository.obtenerTodo();

        console.log('Total ordenes obtenidas:', ordenesTodas.length);
        return ordenesTodas;
    }
}
