import { Router } from 'express';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const router = Router();

router.post('/', async (req, res) => {
    const order = req.body;
    const db = getFirestore();

    if (!order || !order.items || order.items.length === 0) {
        return res.status(400).send('La orden es inválida.');
    }

    try {
        const batch = db.batch();
        const ordersRef = db.collection("orders");

        const outOfStock = [];

        const productPromises = order.items.map(item => db.collection("products").doc(item.firestoreId).get());
        const productSnapshots = await Promise.all(productPromises);

        productSnapshots.forEach((docSnap, index) => {
            if (docSnap.exists) {
                const product = docSnap.data();
                const cartItem = order.items[index];

                if (product.stock >= cartItem.quantity) {
                    batch.update(docSnap.ref, { stock: product.stock - cartItem.quantity });
                } else {
                    outOfStock.push({ ...product, id: docSnap.id });
                }
            }
        });

        if (outOfStock.length > 0) {
            return res.status(400).json({
                error: 'Los siguientes productos no tienen stock suficiente',
                products: outOfStock.map(p => p.title)
            });
        }

        const newOrderRef = ordersRef.doc();
        batch.set(newOrderRef, { ...order, createdAt: Timestamp.now() });

        await batch.commit();

        res.status(201).json({ orderId: newOrderRef.id });

    } catch (error) {
        console.error("Error creando la orden: ", error);
        res.status(500).send('Error del servidor al crear la orden.');
    }
});

router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
    const db = getFirestore();

    if (!uid) {
        return res.status(400).send('El UID del usuario es requerido.');
    }

    try {
        const ordersRef = db.collection("orders");
        const q = ordersRef.where("buyer.uid", "==", uid).orderBy("createdAt", "desc");
        const snapshot = await q.get();

        if (snapshot.empty) {
            return res.status(404).send('No se encontraron órdenes para este usuario.');
        }

        const orders = [];
        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(orders);

    } catch (error) {
        console.error("Error obteniendo las órdenes: ", error);
        res.status(500).send('Error del servidor al obtener las órdenes.');
    }
});

export default router;
