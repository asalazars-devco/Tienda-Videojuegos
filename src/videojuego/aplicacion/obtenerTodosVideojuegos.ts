import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class ObtenerTodosVideojuegos {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar() {
        const videojuegosTodos = await this.videojuegoRepository.obtenerTodo();

        console.log('Total videojuegos obtenidos:', videojuegosTodos.length);
        return videojuegosTodos;
    }
}
