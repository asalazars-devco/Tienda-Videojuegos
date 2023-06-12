import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class ObtenerVideojuegoPorId {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(idVideojuego: number) {
        const videojuego = await this.videojuegoRepository.obtenerPorId(
            idVideojuego
        );

        if (!videojuego) {
            throw new Error(`Videojuego no encontrado`);
        }

        console.log('videojuego obtenido: ', videojuego.nombre);
        return videojuego;
    }
}
