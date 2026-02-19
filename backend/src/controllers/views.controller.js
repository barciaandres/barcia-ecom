import getDAO from '../daos/factory.js';

const productsDao = getDAO('products');
const categoriesDao = getDAO('categories');

const getProductsAdmin = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };

        if (sort) {
            const [field, order] = sort.split('-');
            if ((field === 'price' || field === 'stock') && (order === 'asc' || order === 'desc')) {
                options.sort = { [field]: order === 'asc' ? 1 : -1 };
            }
        }

        const queryOptions = {};
        if (query) {
            queryOptions.title = { $regex: query, $options: 'i' };
        }
        if (category) {
            queryOptions.category = category;
        }

        const [products, categories] = await Promise.all([
            productsDao.getAllProducts(queryOptions, options),
            categoriesDao.getAllCategories()
        ]);

        res.render('products', {
            products,
            categories,
            selectedCategory: category,
            currentSort: sort,
            currentQuery: query
        });

    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, brand, category, description, thumbnail, price, stock } = req.body;

        if (!title || !brand || !category || !description || !price || !stock) {
            return res.status(400).send('Todos los campos obligatorios deben ser proporcionados.');
        }
        if (parseFloat(price) <= 0) {
            return res.status(400).send('El precio debe ser un número positivo.');
        }
        if (parseInt(stock, 10) < 0) {
            return res.status(400).send('El stock debe ser un número no negativo.');
        }

        const newProduct = {
            title,
            brand,
            category,
            description,
            thumbnail,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
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
            productsDao.getProductById(req.params.pid),
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
        const productId = req.params.pid;
        const { title, brand, category, description, thumbnail, price, stock } = req.body;


        if (!title || !brand || !category || !description || !price || !stock) {
            return res.status(400).send('Todos los campos obligatorios deben ser proporcionados.');
        }
        if (parseFloat(price) <= 0) {
            return res.status(400).send('El precio debe ser un número positivo.');
        }
        if (parseInt(stock, 10) < 0) {
            return res.status(400).send('El stock debe ser un número no negativo.');
        }

        const updates = {
            title,
            brand,
            category,
            description,
            thumbnail,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
        };

        const updatedProduct = await productsDao.updateProduct(productId, updates);

        if (!updatedProduct) {
            return res.status(404).send('Producto no encontrado.');
        }

        req.io.emit('productUpdated', updatedProduct);

        res.redirect('/views/products');
    } catch (error) {
        console.error("Error actualizando producto: ", error);
        res.status(500).send('Error del servidor al actualizar el producto.');
    }
};
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
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
        const products = await productsDao.getAllProducts({}, { limit: 10, page: 1, lean: true });
        res.render('home', { products });

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