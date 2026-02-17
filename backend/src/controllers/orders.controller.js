import getDAO from '../daos/factory.js';

const ordersDao = getDAO('orders');
const productsDao = getDAO('products');

const createOrder = async (req, res) => {
    const order = req.body;
    const userId = req.user.id;
    if (!order || !order.items || order.items.length === 0) {
        return res.status(400).send('La orden es inválida.');
    }
    try {
        const outOfStock = [];
        const productsInOrder = [];
        for (const item of order.items) {
            const product = item.product;
            if (!product) {
                outOfStock.push({ id: item.product._id, title: 'Producto no encontrado' });
                continue;
            }
            if (product.stock >= item.quantity) {
                productsInOrder.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price
                });
            } else {
                outOfStock.push({ id: product._id, title: product.title, requested: item.quantity, available: product.stock });
            }
        }
        if (outOfStock.length > 0) {
            return res.status(400).json({
                error: 'Los siguientes productos no tienen stock suficiente o no fueron encontrados',
                products: outOfStock.map(p => ({ id: p.id, title: p.title || p.id, requested: p.requested, available: p.available }))
            });
        }
        for (const item of order.items) {
            await productsDao.updateProduct(item.product._id, { $inc: { stock: -item.quantity } });
        }
        const newOrder = await ordersDao.createOrder({
            userId: userId,
            email: order.email,
            name: order.name,
            phone: order.phone,
            products: productsInOrder,
            total: order.total,
            status: order.status || 'pending',
        });
        res.status(201).json({ orderId: newOrder.id });
    } catch (error) {
        console.error("Error creando la orden: ", error);
        res.status(500).send('Error del servidor al crear la orden.');
    }
};

const getOrdersByUser = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).send('El ID del usuario autenticado es requerido.');
    }
    try {
        const orders = await ordersDao.getAllOrders();
        const userOrders = orders.filter(o => o.userId === userId);

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