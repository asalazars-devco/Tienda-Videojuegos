import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class ObtenerVideojuegoPorId {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(idVideojuego: string) {
        const videojuego = await this.videojuegoRepository.obtenerPorId(
            idVideojuego
        );

        if (!videojuego) {
            throw new Error(`No existe videojuego con ID: ${idVideojuego}`);
        }

        console.log('videojuego obtenido: ', videojuego.nombre);
        return videojuego;
    }
}
