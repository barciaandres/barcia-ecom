import getDAO from '../daos/factory.js';

const categoriesDao = getDAO('categories');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoriesDao.getAllCategories();

        if (!categories || categories.length === 0) {
            return res.status(404).send('No se encontraron categorías.');
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error obteniendo categorías: ", error);
        res.status(500).send('Error del servidor al obtener las categorías.');
    }
};

export {
    getAllCategories
};
