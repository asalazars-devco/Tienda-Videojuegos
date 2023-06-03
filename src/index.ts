import express from 'express';
import { videojuegoRouter } from './infraestructura/videojuegoRouter';

const app = express();

app.use(express.json());

const PORT = 3000;

app.use('/videojuegos', videojuegoRouter);

app.listen(PORT, () => {
    console.log(`Server application running on port ${PORT}`);
});
