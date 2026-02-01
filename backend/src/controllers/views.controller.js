import { db } from '../firebase/config.js';

const getProductsAdmin = async (req, res) => {
    try {
        const productsRef = db.collection('products').orderBy('meta.updatedAt', 'desc').limit(25);
        const categoriesRef = db.collection('categories');

        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
            productsRef.get(),
            categoriesRef.get()
        ]);

        const products = [];
        productsSnapshot.forEach(doc => {
            products.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        const categories = [];
        categoriesSnapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.render('products', { products, categories });

    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, brand, category, description, thumbnail, price, stock } = req.body;
        const newProduct = {
            title,
            brand,
            category,
            description,
            thumbnail,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };
        const docRef = await db.collection('products').add(newProduct);
        req.io.emit('productCreated', { firestoreId: docRef.id, ...newProduct });

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error creando producto: ", error);
        res.status(500).send('Error del servidor al crear el producto.');
    }
};

const getEditProductForm = async (req, res) => {
    try {
        const productRef = db.collection('products').doc(req.params.id);
        const categoriesRef = db.collection('categories');

        const [productDoc, categoriesSnapshot] = await Promise.all([
            productRef.get(),
            categoriesRef.get()
        ]);

        if (!productDoc.exists) {
            return res.status(404).send('Producto no encontrado.');
        }

        const categories = [];
        categoriesSnapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.render('edit-product', {
            product: { ...productDoc.data(), id: productDoc.id },
            categories: categories
        });

    } catch (error) {
        console.error("Error obteniendo producto para editar: ", error);
        res.status(500).send('Error del servidor.');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, brand, category, description, thumbnail, price, stock } = req.body;
        const updatedProduct = {
            title,
            brand,
            category,
            description,
            thumbnail,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
        };
        const productRef = db.collection('products').doc(req.params.id);
        
        await productRef.update({
            ...updatedProduct,
            'meta.updatedAt': new Date().toISOString()
        });

        const updatedDoc = await productRef.get();
        req.io.emit('productUpdated', { firestoreId: updatedDoc.id, ...updatedDoc.data() });

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error actualizando producto: ", error);
        res.status(500).send('Error del servidor al actualizar el producto.');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        req.io.emit('productDeleted', productId);

        await db.collection('products').doc(productId).delete();
        
        res.redirect('/views/products');
    } catch (error) {
        console.error("Error eliminando producto: ", error);
        res.status(500).send('Error del servidor al eliminar el producto.');
    }
};

const getHomePage = async (req, res) => {
    try {
        const productsRef = db.collection('products').orderBy('meta.updatedAt', 'desc').limit(25);
        const snapshot = await productsRef.get();

        const products = [];
        snapshot.forEach(doc => {
            products.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        res.render('home', { products });

    } catch (error) {
        console.error("Error obteniendo productos para home: ", error);
        res.status(500).send('Error del servidor.');
    }
};

const getRealTimeProducts = async (req, res) => {
    try {
        const productsRef = db.collection('products').orderBy('meta.updatedAt', 'desc').limit(25);
        const categoriesRef = db.collection('categories');

        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
            productsRef.get(),
            categoriesRef.get()
        ]);

        const products = [];
        productsSnapshot.forEach(doc => {
            products.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        const categories = [];
        categoriesSnapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.render('real-time-products', { products, categories });

    } catch (error) {
        console.error("Error obteniendo productos en tiempo real: ", error);
        res.status(500).send('Error del servidor.');
    }
};

export {
    getProductsAdmin,
    createProduct,
    getEditProductForm,
    updateProduct,
    deleteProduct,
    getHomePage,
    getRealTimeProducts
};
