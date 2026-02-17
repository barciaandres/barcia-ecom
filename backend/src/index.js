import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 8080;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection
const connectDB = async () => {
  console.log('[connectDB] Attempting to connect to MongoDB...');
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('[connectDB] MONGODB_URI environment variable is not set.');
      return;
    }
    console.log(`[connectDB] MONGODB_URI found. Connecting...`);
    await mongoose.connect(uri);
    console.log('[connectDB] MongoDB connected successfully.');
  } catch (err) {
    console.error('[connectDB] MongoDB connection error:', err.message);
    // Do not exit the process in a serverless environment
  }
};

import productsRouter from './routes/productsRoutes.js';
import categoriesRouter from './routes/categoriesRoutes.js';
import ordersRouter from './routes/ordersRoutes.js';
import viewsRouter from './routes/viewsRoutes.js';
import usersRoutes from './routes/usersRoutes.js'; // Added
import cartsRouter from './routes/cartsRoutes.js';

console.log('[index.js] File loaded');

// Configuración de Handlebars
app.engine('handlebars', engine({
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  },
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Middlewares
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/views/home');
});

// Middleware para inyectar io en las peticiones
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas de Vistas (Front y back en mismo server, tengo que usar /views, no puedo dejar las vistas en la raíz)
app.use('/views', viewsRouter);

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', (req, res, next) => {
  console.log('[index.js] Request received for /api/categories');
  categoriesRouter(req, res, next);
});
app.use('/api/users', usersRoutes);
app.use('/api/carts', cartsRouter);

import getDAO from './daos/factory.js';

// io.on('connection', async (socket) => {
//   console.log('Un cliente se ha conectado');
//
//   // Cargar productos iniciales y enviarlos al cliente
//   const productsDao = getDAO('products');
//   const products = await productsDao.getAllProducts();
//   socket.emit('updateProducts', products.slice(0, 10)); // Envía solo los primeros 10
//
//   socket.on('disconnect', () => {
//     console.log('Un cliente se ha desconectado');
//   });
// });

connectDB();

export default app;
