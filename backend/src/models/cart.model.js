import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      _id: false,
    },
  ],
}, { timestamps: true });

export const CartModel = model('Cart', cartSchema);
