import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class EliminarVideojuego {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(idVideojuego: number) {
        const videojuego = await this.videojuegoRepository.eliminar(
            idVideojuego
        );

        if (!videojuego) {
            throw new Error(`Videojuego no encontrado`);
        }

        return videojuego;
    }
}
