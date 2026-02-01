import getDAO from '../daos/factory.js';

const productsDao = getDAO('products');

//todo Tengo que hacer pagionador
const getAllProducts = async (req, res) => {
    try {
        const products = await productsDao.getAllProducts();

        if (!products || products.length === 0) {
            return res.status(404).send('No se encontraron productos.');
        }

        res.status(200).json(products);

    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productsDao.getProductById(id);

        if (!product) {
            return res.status(404).send('No se encontró el producto.');
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error obteniendo el producto: ", error);
        res.status(500).send('Error del servidor al obtener el producto.');
    }
};

//todo paginador
const getProductsByCategory = async (req, res) => {
    const { categoryName } = req.params;
    try {
        const products = await productsDao.getProductsByCategory(categoryName);

        if (!products || products.length === 0) {
            return res.status(404).send('No se encontraron productos para esta categoría.');
        }

        res.status(200).json(products);

    } catch (error) {
        console.error("Error obteniendo productos por categoría: ", error);
        res.status(500).send('Error del servidor al obtener los productos.');
    }
};

export {
    getAllProducts,
    getProductById,
    getProductsByCategory
};
