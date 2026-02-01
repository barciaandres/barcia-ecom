import getDAO from '../daos/factory.js';

const productsDao = getDAO('products');
const categoriesDao = getDAO('categories');

const getProductsAdmin = async (req, res) => {
    try {
        const [products, categories] = await Promise.all([
            productsDao.getAllProducts(),
            categoriesDao.getAllCategories()
        ]);

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
        const createdProduct = await productsDao.createProduct(newProduct);
        req.io.emit('productCreated', createdProduct);

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error creando producto: ", error);
        res.status(500).send('Error del servidor al crear el producto.');
    }
};

const getEditProductForm = async (req, res) => {
    try {
        const [product, categories] = await Promise.all([
            productsDao.getProductById(req.params.id),
            categoriesDao.getAllCategories()
        ]);

        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        res.render('edit-product', {
            product,
            categories
        });

    } catch (error) {
        console.error("Error obteniendo producto para editar: ", error);
        res.status(500).send('Error del servidor.');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, brand, category, description, thumbnail, price, stock } = req.body;
        const product = await productsDao.getProductById(req.params.id);

        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        const updatedProduct = {
            ...product,
            title,
            brand,
            category,
            description,
            thumbnail,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            meta: {
                ...product.meta,
                updatedAt: new Date().toISOString()
            }
        };
        
        await productsDao.updateProduct(updatedProduct);

        req.io.emit('productUpdated', updatedProduct);

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error actualizando producto: ", error);
        res.status(500).send('Error del servidor al actualizar el producto.');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await productsDao.deleteProduct(productId);
        req.io.emit('productDeleted', productId);
        
        res.redirect('/views/products');
    } catch (error) {
        console.error("Error eliminando producto: ", error);
        res.status(500).send('Error del servidor al eliminar el producto.');
    }
};

const getHomePage = async (req, res) => {
    try {
        const products = await productsDao.getAllProducts();
        res.render('home', { products: products.slice(0, 25) });

    } catch (error) {
        console.error("Error obteniendo productos para home: ", error);
        res.status(500).send('Error del servidor.');
    }
};

const getRealTimeProducts = async (req, res) => {
    try {
        res.render('real-time-products', { products: [] });
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