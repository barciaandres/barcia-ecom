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
router.get('/products/edit/:pid', getEditProductForm);
router.post('/products/edit/:pid', updateProduct);
router.post('/products/delete/:pid', deleteProduct);
router.get('/home', getHomePage);
router.get('/realtimeproducts', getRealTimeProducts);

export default router;

