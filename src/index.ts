import express from 'express';
import { videojuegoRouter } from './videojuego/infraestructura/videojuegoRouter';
import { ordenRouter } from './orden/infraestructura/ordenRouter';

const app = express();

app.use(express.json());

const PORT = 3000;

app.use('/videojuegos', videojuegoRouter);

app.use('/ordenes', ordenRouter);

app.listen(PORT, () => {
    console.log(`Server application running on port ${PORT}`);
});
