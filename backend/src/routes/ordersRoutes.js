import { Router } from 'express';
import {
    createOrder,
    getOrdersByUser
} from '../controllers/orders.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrdersByUser);

export default router;

