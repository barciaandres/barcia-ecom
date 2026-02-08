import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    userId: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    phone: { type: String },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

const OrderModel = mongoose.model('orders', OrderSchema);

export default OrderModel;