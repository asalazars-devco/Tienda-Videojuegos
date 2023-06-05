import { VideojuegoRepository } from '../dominio/videojuegoRepository';

export class CrearVideojuego {
    constructor(private readonly videojuegoRepository: VideojuegoRepository) {}

    async ejecutar(
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ) {
        const videojuegoCreado = await this.videojuegoRepository.crear(
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        console.log('videojuego creado:', videojuegoCreado.nombre);
        return videojuegoCreado;
    }
}
