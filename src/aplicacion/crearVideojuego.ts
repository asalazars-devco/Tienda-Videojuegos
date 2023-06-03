import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class CrearVideojuego {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(
        idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ) {
        const videojuegoCreado = await this.videojuegoRepository.crear(
            idVideojuego,
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        console.log(videojuegoCreado.nombre);
        return videojuegoCreado;
    }
}
