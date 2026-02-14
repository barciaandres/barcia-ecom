import getDAO from '../daos/factory.js';

const cartsDAO = getDAO('carts');

// Obtiene el carrito del usuario logueado
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await cartsDAO.getCartByUserId(userId);
    if (!cart) {
      cart = await cartsDAO.createCart(userId);
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agrega un ítem al carrito
export const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    const cart = await cartsDAO.addItem(userId, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Elimina un ítem del carrito
export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cart = await cartsDAO.removeItem(userId, productId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualiza la cantidad de un ítem
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
    }
    const cart = await cartsDAO.updateItemQuantity(userId, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Limpia el carrito
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await cartsDAO.clearCart(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sincroniza el carrito local con el de la base de datos
export const syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Se espera un array de items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Cart items must be an array' });
    }
    const cart = await cartsDAO.syncCart(userId, items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

