import { db } from '../firebase/config.js';

const getProductsAdmin = async (req, res) => {
    try {
        const productsRef = db.collection('products').orderBy('title');
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
            stock: parseInt(stock, 10)
        };
        await db.collection('products').add(newProduct);

        const productsRef = db.collection('products').orderBy('title');
        const snapshot = await productsRef.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ firestoreId: doc.id, ...doc.data() });
        });
        req.io.emit('updateProducts', products);

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
            stock: parseInt(stock, 10)
        };
        await db.collection('products').doc(req.params.id).update(updatedProduct);

        const productsRef = db.collection('products').orderBy('title');
        const snapshot = await productsRef.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ firestoreId: doc.id, ...doc.data() });
        });
        req.io.emit('updateProducts', products);

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error actualizando producto: ", error);
        res.status(500).send('Error del servidor al actualizar el producto.');
    }
};

const deleteProduct = async (req, res) => {
    try {
        await db.collection('products').doc(req.params.id).delete();

        const productsRef = db.collection('products').orderBy('title');
        const snapshot = await productsRef.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ firestoreId: doc.id, ...doc.data() });
        });
        req.io.emit('updateProducts', products);
        
        res.redirect('/views/products');
    } catch (error) {
        console.error("Error eliminando producto: ", error);
        res.status(500).send('Error del servidor al eliminar el producto.');
    }
};

const getHomePage = async (req, res) => {
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

        res.render('home', { products });

    } catch (error) {
        console.error("Error obteniendo productos para home: ", error);
        res.status(500).send('Error del servidor.');
    }
};

const getRealTimeProducts = async (req, res) => {
    try {
        const productsRef = db.collection('products').orderBy('title');
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
