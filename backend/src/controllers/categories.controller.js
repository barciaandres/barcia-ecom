import { db } from '../firebase/config.js';

const getAllCategories = async (req, res) => {
    try {
        const categoriesRef = db.collection('categories');
        const snapshot = await categoriesRef.get();

        if (snapshot.empty) {
            return res.status(404).send('No se encontraron categorías.');
        }

        const categories = [];
        snapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(categories);

    } catch (error) {
        console.error("Error obteniendo categorías: ", error);
        res.status(500).send('Error del servidor al obtener las categorías.');
    }
};

export {
    getAllCategories
};
