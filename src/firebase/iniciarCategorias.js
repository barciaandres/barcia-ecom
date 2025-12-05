import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { app } from "./config.js";

const db = getFirestore(app);

const seedCategories = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const categories = await response.json();

        const categoriesCollection = collection(db, 'categories');
        const batch = writeBatch(db);

        categories.forEach(category => {
            const newDoc = doc(categoriesCollection);
            batch.set(newDoc, {
                name: category.name,
                slug: category.slug
            });
        });

        await batch.commit();

        console.log('Categories agregadas correctamente');

    } catch (error) {
        console.error('Error al agregar categories: ', error);
    }
}

seedCategories();

export default seedCategories;
