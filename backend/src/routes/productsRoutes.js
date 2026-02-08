import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    getProductsByCategory
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categorySlug', getProductsByCategory);

export default router;

