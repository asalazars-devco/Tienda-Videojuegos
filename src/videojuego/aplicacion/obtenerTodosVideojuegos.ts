import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class ObtenerTodosVideojuegos {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar() {
        const videojuegosTodos = await this.videojuegoRepository.obtenerTodo();

        return videojuegosTodos;
    }
}
