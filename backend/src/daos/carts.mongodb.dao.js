import { CartModel } from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import UserModel from '../models/user.model.js';

class CartsMongoDbDao {
  async getCartByUserId(userId) {
    return CartModel.findOne({ user: userId }).populate('items.product');
  }

  async createCart(userId) {
    return CartModel.create({ user: userId, items: [] });
  }

  async addItem(userId, productId, quantity) {
    const cart = await this.getCartByUserId(userId) || await this.createCart(userId);
    const productExists = cart.items.find(item => item.product._id.toString() === productId);

    if (productExists) {
      productExists.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    return this.getCartByUserId(userId);
  }

  async removeItem(userId, productId) {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new Error('El carrito no existe');
    }
    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    await cart.save();
    return this.getCartByUserId(userId);
  }

  async updateItemQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new Error('El carrito no existe');
    }
    const item = cart.items.find(item => item.product._id.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
    }
    return this.getCartByUserId(userId);
  }

  async clearCart(userId) {
    const cart = await this.getCartByUserId(userId);
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return cart;
  }

  async syncCart(userId, localCartItems) {
    let userCart = await this.getCartByUserId(userId);

    if (!userCart) {
      userCart = await this.createCart(userId);
    }

    if (!localCartItems || localCartItems.length === 0) {
      return userCart;
    }

    for (const localItem of localCartItems) {
      const existingItem = userCart.items.find(
        (dbItem) => dbItem.product._id.toString() === localItem.id
      );

      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        userCart.items.push({
          product: localItem.id,
          quantity: localItem.quantity,
        });
      }
    }

    await userCart.save();
    return this.getCartByUserId(userId);
  }
}

export default CartsMongoDbDao;
