import { Videojuego } from '../dominio/videojuego';
import { VideojuegoRepository } from '../dominio/videojuegoRepository';

const videojuegosDB: Videojuego[] = [
    {
        id: '1',
        nombre: 'FIFA 23',
        precio: 70,
        imagen: 'https://falabella.scene7.com/is/image/FalabellaCO/45126449_1?wid=800&hei=800&qlt=70',
        stock: 10,
    },
    {
        id: '2',
        nombre: 'Spiderman',
        precio: 45,
        imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/B2aUYFC0qUAkNnjbTHRyhrg3.png',
        stock: 8,
    },
    {
        id: '3',
        nombre: 'Assasins Creed',
        precio: 95,
        imagen: 'https://cosonyb2c.vtexassets.com/arquivos/ids/348240/Assassin-s-Creed-Valhalla.jpg?v=1765520317',
        stock: 5,
    },
];

export class MockVideojuegosRepository implements VideojuegoRepository {
    async obtenerPorId(idVideojuego: string): Promise<Videojuego | null> {
        const videojuego: Videojuego | undefined = videojuegosDB.find(
            (videojuego) => videojuego.id === idVideojuego
        );

        return videojuego
            ? new Videojuego(
                  videojuego.id,
                  videojuego.nombre,
                  videojuego.precio,
                  videojuego.imagen,
                  videojuego.stock
              )
            : null;
    }

    async obtenerTodo(): Promise<Videojuego[] | []> {
        return videojuegosDB.map((videojuego) => {
            return new Videojuego(
                videojuego.id,
                videojuego.nombre,
                videojuego.precio,
                videojuego.imagen,
                videojuego.stock
            );
        });
    }

    async crear(
        // idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego> {
        const videojuegoNuevo = new Videojuego(
            'idVideojuego',
            nombreVideojuego,
            precioVideojuego,
            imagenVideojuego,
            stockVideojuego
        );

        videojuegosDB.push(videojuegoNuevo);
        return videojuegoNuevo;
    }

    async actualizar(
        idVideojuego: string,
        nombreVideojuego: string,
        precioVideojuego: number,
        imagenVideojuego: string,
        stockVideojuego: number
    ): Promise<Videojuego> {
        const videojuegoIndex = videojuegosDB.findIndex(
            (videojuego) => videojuego.id === idVideojuego
        );

        if (videojuegoIndex !== -1) {
            videojuegosDB[videojuegoIndex] = new Videojuego(
                idVideojuego,
                nombreVideojuego,
                precioVideojuego,
                imagenVideojuego,
                stockVideojuego
            );
        } else {
            throw new Error('ID no encontrado en la base de datos');
        }
        return videojuegosDB[videojuegoIndex];
    }

    async eliminar(idVideojuego: string): Promise<Videojuego> {
        const videojuegoIndex = videojuegosDB.findIndex(
            (videojuego) => videojuego.id === idVideojuego
        );

        if (videojuegoIndex !== -1) {
            const videojuegoEliminado = videojuegosDB.splice(
                videojuegoIndex,
                1
            );
            return videojuegoEliminado[0];
        } else {
            throw new Error('ID no encontrado en la base de datos');
        }
    }
}
