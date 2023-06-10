import express from 'express';
import { videojuegoRouter } from './videojuego/infraestructura/videojuegoRouter';
import { ordenRouter } from './orden/infraestructura/ordenRouter';
import { usuarioRouter } from './usuario/infraestructura/usuarioRouter';

const app = express();

app.use(express.json());

const PORT = 3000;

app.use('/videojuego', videojuegoRouter);

app.use('/orden', ordenRouter);

app.use('/usuario', usuarioRouter);

app.listen(PORT, () => {
    console.log(`Server application running on port ${PORT}`);
});
