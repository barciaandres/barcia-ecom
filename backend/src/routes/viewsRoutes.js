import { Router } from 'express';
import {
    getProductsAdmin,
    createProduct,
    getEditProductForm,
    updateProduct,
    deleteProduct,
    getHomePage,
    getRealTimeProducts
} from '../controllers/views.controller.js';

const router = Router();

router.get('/products', getProductsAdmin);
router.post('/products', createProduct);
router.get('/products/edit/:id', getEditProductForm);
router.post('/products/edit/:id', updateProduct);
router.post('/products/delete/:id', deleteProduct);
router.get('/home', getHomePage);
router.get('/realtimeproducts', getRealTimeProducts);

export default router;

