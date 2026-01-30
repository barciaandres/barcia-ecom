import { Router } from 'express';
import { db } from '../firebase/config.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();

        if (snapshot.empty) {
            return res.status(404).send('No se encontraron productos.');
        }

        const products = [];
        snapshot.forEach(doc => {
            products.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(products);

    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productRef = db.collection('products').doc(id);
        const doc = await productRef.get();

        if (!doc.exists) {
            return res.status(404).send('No se encontró el producto.');
        }

        res.status(200).json({
            firestoreId: doc.id,
            ...doc.data()
        });

    } catch (error) {
        console.error("Error obteniendo el producto: ", error);
        res.status(500).send('Error del servidor al obtener el producto.');
    }
});

router.get('/category/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    try {
        const productsRef = db.collection('products');
        const q = productsRef.where('category', '==', categoryName);
        const snapshot = await q.get();

        if (snapshot.empty) {
            return res.status(404).send('No se encontraron productos para esta categoría.');
        }

        const products = [];
        snapshot.forEach(doc => {
            products.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(products);

    } catch (error) {
        console.error("Error obteniendo productos por categoría: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
});

export default router;
