import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class EliminarVideojuego {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(idVideojuego: string) {
        const videojuego = await this.videojuegoRepository.eliminar(
            idVideojuego
        );

        if (!videojuego) {
            throw new Error(`No existe videojuego con ID: ${idVideojuego}`);
        }

        console.log('videojuego eliminado: ', videojuego.nombre);
        return videojuego;
    }
}
