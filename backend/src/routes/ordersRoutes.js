import { Router } from 'express';
import {
    createOrder,
    getOrdersByUser
} from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/:uid', getOrdersByUser);

export default router;

