import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class ActualizarVideojuego {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(
        idVideojuego: number,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ) {
        const videojuegoActualizado =
            await this.videojuegoRepository.actualizar(
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            );

        if (!videojuegoActualizado) {
            throw new Error(`No existe videojuego con ID: ${idVideojuego}`);
        }

        console.log('juego actualizado:', videojuegoActualizado.nombre);
        return videojuegoActualizado;
    }
}
