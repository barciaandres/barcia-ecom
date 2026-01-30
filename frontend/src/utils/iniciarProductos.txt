import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { app } from "./config.js";

const db = getFirestore(app);

const seedProducts = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=1000&skip=0');
        const data = await response.json();
        const productsToAdd = data.products;

        const batch = writeBatch(db);
        productsToAdd.forEach(product => {
            //console.log(product.title);
            const docRef = doc(collection(db, "products"));
            batch.set(docRef, product);
        });

        await batch.commit();
        console.log("Todos ok");
    } catch (e) {
        console.error("Error al agregar productos: ", e);
    }
};

seedProducts();

export default seedProducts;
