import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

import productsRouter from './routes/productsRoutes.js';
import categoriesRouter from './routes/categoriesRoutes.js';
import ordersRouter from './routes/ordersRoutes.js';

// Middlewares
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.send('Backend de Barcia E-commerce');
});

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoriesRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
