import OrderModel from '../models/order.model.js';

class OrdersMongodbDao {
    constructor() {
    }

    async getAllOrders() {
        return await OrderModel.find().populate('products.productId').lean();
    }

    async getOrderById(id) {
        return await OrderModel.findOne({ id: id }).populate('products.productId').lean();
    }

    async createOrder(order) {
        const lastOrder = await OrderModel.findOne().sort({ id: -1 }).lean();
        const newId = lastOrder ? lastOrder.id + 1 : 1;
        order.id = newId;
        const newOrder = new OrderModel(order);
        await newOrder.save();
        return newOrder.toObject();
    }

    async updateOrder(id, updates) {
        const updated = await OrderModel.findOneAndUpdate(
            { id: id },
            { $set: updates },
            { new: true }
        ).lean();
        return updated;
    }

    async deleteOrder(id) {
        await OrderModel.deleteOne({ id: id });
    }
}

export default OrdersMongodbDao;
