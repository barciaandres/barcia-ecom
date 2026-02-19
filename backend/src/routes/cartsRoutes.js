import { Router } from 'express';
import * as cartController from '../controllers/carts.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware para asegurar que el usuario está autenticado en todas las rutas de carritos
router.use(verifyToken);

// GET /api/carts/ - Obtener el carrito del usuario
router.get('/', cartController.getCart);

// POST /api/carts/sync - Sincronizar el carrito de localstorage con el de la BD
// Profe, esta función la hice para mantener un carrito en localstorage cuando no está logueado y transferirlo a la bd
//al loguearse
router.post('/sync', cartController.syncCart);

// POST /api/carts/items - Agregar un ítem al carrito
router.post('/items', cartController.addItem);

// PUT /api/carts/items/:productId - Actualizar la cantidad de un ítem
router.put('/items/:productId', cartController.updateItemQuantity);

// DELETE /api/carts/items/:productId - Eliminar un ítem del carrito
router.delete('/items/:productId', cartController.removeItem);

// DELETE /api/carts/ - Vaciar el carrito
router.delete('/', cartController.clearCart);

export default router;
