import { getFirestore, collection, addDoc, getDocs, writeBatch, doc, query, where, getDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { app } from "./config.js";

const db = getFirestore(app);

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ firestoreId: doc.id, ...doc.data() });
        });
        return products;
    } catch (e) {
        console.error("Error al obtener productos: ", e);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
    } catch (e) {
        console.error("Error al obtener categorias: ", e);
        return [];
    }
};

export const getProductsByCategory = async (categoryName) => {
    try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", categoryName));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ firestoreId: doc.id, ...doc.data() });
        });
        return products;
    } catch (e) {
        console.error("Error al obtener productos por categoria: ", e);
        return [];
    }
};

export const getProductById = async (productId) => {
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { firestoreId: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error al obtener producto ", e);
        return null;
    }
};

export const createOrder = async (order) => {
    const batch = writeBatch(db);
    const ordersRef = collection(db, "orders");

    const outOfStock = [];

    const productPromises = order.items.map(item => getDoc(doc(db, "products", item.firestoreId)));
    const productSnapshots = await Promise.all(productPromises);

    productSnapshots.forEach((docSnap, index) => {
        if (docSnap.exists()) {
            const product = docSnap.data();
            const cartItem = order.items[index];

            if (product.stock >= cartItem.quantity) {
                batch.update(docSnap.ref, { stock: product.stock - cartItem.quantity });
            }
            else {
                outOfStock.push({ ...product, id: docSnap.id });
            }
        }
    });

    if (outOfStock.length > 0) {
        throw new Error(`Los siguientes productos no tienen stock suficiente: ${outOfStock.map(p => p.title).join(', ')}`);
    }

    const newOrderRef = doc(ordersRef);
    batch.set(newOrderRef, { ...order, createdAt: serverTimestamp() });

    await batch.commit();

    return newOrderRef.id;
};

export const getOrders = async () => {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (e) {
        console.error("Error al obtener ordenes: ", e);
        return [];
    }
};
