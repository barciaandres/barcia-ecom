import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const port = 8080;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import productsRouter from './routes/productsRoutes.js';
import categoriesRouter from './routes/categoriesRoutes.js';
import ordersRouter from './routes/ordersRoutes.js';
import viewsRouter from './routes/viewsRoutes.js';
import { db } from './firebase/config.js';

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

// Rutas de Vistas
app.use('/views', viewsRouter);

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoriesRouter);

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Función para obtener y enviar productos
  const getAndSendProducts = async () => {
    try {
      const productsRef = db.collection('products').orderBy('title');
      const snapshot = await productsRef.get();
      const products = [];
      snapshot.forEach(doc => {
        products.push({
          firestoreId: doc.id,
          ...doc.data()
        });
      });
      socket.emit('updateProducts', products); // Enviar solo al cliente que se conecta
    } catch (error) {
      console.error("Error obteniendo y enviando productos: ", error);
    }
  };

  // Enviar productos al cliente recién conectado
  getAndSendProducts();

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
