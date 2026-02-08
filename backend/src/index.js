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
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Conectado...');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

import productsRouter from './routes/productsRoutes.js';
import categoriesRouter from './routes/categoriesRoutes.js';
import ordersRouter from './routes/ordersRoutes.js';
import viewsRouter from './routes/viewsRoutes.js';
import usersRoutes from './routes/usersRoutes.js'; // Added

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
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRoutes);

import getDAO from './daos/factory.js';

io.on('connection', async (socket) => {
  console.log('Un cliente se ha conectado');

  // Cargar productos iniciales y enviarlos al cliente
  const productsDao = getDAO('products');
  const products = await productsDao.getAllProducts();
  socket.emit('updateProducts', products.slice(0, 25)); // Envía solo los primeros 25

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Start the server after connecting to the database
connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
});
