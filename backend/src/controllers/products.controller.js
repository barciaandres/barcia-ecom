import getDAO from '../daos/factory.js';

const productsDao = getDAO('products');
const categoriesDao = getDAO('categories');

const getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const queryOptions = {};
        if (query) {
            queryOptions.$or = [
                { category: { $regex: query, $options: 'i' } },
                { status: { $regex: query, $options: 'i' } }
            ];
        }

        const result = await productsDao.getAllProducts(queryOptions, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        res.status(500).json({ status: 'error', message: 'Error del servidor al obtener los productos.' });
    }
};

const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsDao.getProductById(pid);

        if (!product) {
            return res.status(404).send('No se encontró el producto.');
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error obteniendo el producto: ", error);
        res.status(500).send('Error del servidor al obtener el producto.');
    }
};

const getProductsByCategory = async (req, res) => {
    const { categorySlug } = req.params;
    const { limit = 10, page = 1, sort } = req.query;

    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const queryOptions = { category: categorySlug };

        const result = await productsDao.getAllProducts(queryOptions, options);

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No se encontraron productos para esta categoría.' });
        }

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products/category/${categorySlug}?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}` : null,
            nextLink: result.hasNextPage ? `/api/products/category/${categorySlug}?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}` : null
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error obteniendo productos por categoría: ", error);
        res.status(500).json({ status: 'error', message: 'Error del servidor al obtener los productos.' });
    }
};

export {
    getAllProducts,
    getProductById,
    getProductsByCategory
};
