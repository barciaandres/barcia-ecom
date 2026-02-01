import getDAO from '../daos/factory.js';

const ordersDao = getDAO('orders');
const productsDao = getDAO('products');

const createOrder = async (req, res) => {
    const order = req.body;

    if (!order || !order.items || order.items.length === 0) {
        return res.status(400).send('La orden es inválida.');
    }

    try {
        const outOfStock = [];
        const productsToUpdate = [];

        for (const item of order.items) {
            const product = await productsDao.getProductById(item.id);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                productsToUpdate.push(product);
            } else {
                outOfStock.push(product);
            }
        }


        if (outOfStock.length > 0) {
            return res.status(400).json({
                error: 'Los siguientes productos no tienen stock suficiente',
                products: outOfStock.map(p => p.title)
            });
        }

        for (const product of productsToUpdate) {
            await productsDao.updateProduct(product);
        }

        const newOrder = await ordersDao.createOrder({ ...order, createdAt: new Date() });

        res.status(201).json({ orderId: newOrder.id });

    } catch (error) {
        console.error("Error creando la orden: ", error);
        res.status(500).send('Error del servidor al crear la orden.');
    }
};

const getOrdersByUser = async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).send('El UID del usuario es requerido.');
    }

    try {
        const orders = await ordersDao.getAllOrders();
        const userOrders = orders.filter(o => o.buyer.uid === uid);
        
        if (!userOrders || userOrders.length === 0) {
            return res.status(404).send('No se encontraron órdenes para este usuario.');
        }

        res.status(200).json(userOrders);

    } catch (error) {
        console.error("Error obteniendo las órdenes: ", error);
        res.status(500).send('Error del servidor al obtener las órdenes.');
    }
};


export {
    createOrder,
    getOrdersByUser
};