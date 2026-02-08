import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: String,
    phone: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }, // acá puedo guardar el carrito que está sin finalizar
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;