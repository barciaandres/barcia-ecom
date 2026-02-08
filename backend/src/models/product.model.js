import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnail: { type: String },
    images: { type: [String] },
});

const ProductModel = mongoose.model('products', ProductSchema);

export default ProductModel;