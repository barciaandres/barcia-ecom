import { Router } from 'express';
import {
    createOrder,
    getOrdersByUser
} from '../controllers/orders.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Added

const router = Router();

router.post('/', verifyToken, createOrder); // Protected
router.get('/', verifyToken, getOrdersByUser); // Protected (now fetches orders for the authenticated user)

export default router;

