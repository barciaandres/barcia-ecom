import { useState, useEffect, useContext, useCallback } from 'react';
import CartContext from './CartContext';
import { AuthContext } from './AuthContext';
import { notify } from '../utils/Notifications';

const API_URL = '/api/carts';

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);

    const fetchFromApi = useCallback(async (endpoint = '', options = {}) => {
        const { token } = currentUser || {};
        if (!token) {
            // No intentar hacer llamadas a la API si no hay token
            return;
        }
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la operación del carrito');
        }
        return response.status === 204 ? null : response.json();
    }, [currentUser]);


    useEffect(() => {
        const syncAndLoadCart = async () => {
            setLoading(true);
            try {
                const localCartRaw = JSON.parse(window.localStorage.getItem('cart') || '[]');
                const localCartForApi = localCartRaw.map(item => ({
                    id: item.product ? item.product._id : item.id,
                    quantity: item.quantity
                }));

                let serverCart;
                if (localCartForApi.length > 0) {
                    serverCart = await fetchFromApi('/sync', {
                        method: 'POST',
                        body: JSON.stringify({ items: localCartForApi }),
                    });
                    window.localStorage.removeItem('cart');
                } else {
                    serverCart = await fetchFromApi('/');
                }
                setCart(serverCart.items || []);
            } catch (error) {
                console.error("Error al sincronizar/cargar el carrito:", error);
                setCart([]);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            syncAndLoadCart();
        } else {
            const savedCart = JSON.parse(window.localStorage.getItem('cart') || '[]');
            const unifiedCart = savedCart.map(item => {
                if (item.product) return item; // Ya tiene la estructura correcta
                // Si no, la creamos. Asumimos que el 'item' es el producto.
                return { product: item, quantity: item.quantity };
            });
            setCart(unifiedCart);
            setLoading(false);
        }
    }, [currentUser, fetchFromApi]);

    useEffect(() => {
        if (!currentUser) {
            window.localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, currentUser]);


    const addItem = async (item, quantity) => {
        const { _id, stock, title } = item;
        const existingItem = cart.find(cartItem => cartItem.product._id === _id);

        if (existingItem && (existingItem.quantity + quantity > stock)) {
            return notify(`Stock insuficiente.`, 'error');
        } else if (!existingItem && quantity > stock) {
            return notify(`Stock insuficiente.`, 'error');
        }

        if (currentUser) {
            try {
                const updatedCart = await fetchFromApi('/items', {
                    method: 'POST',
                    body: JSON.stringify({ productId: _id, quantity }),
                });
                setCart(updatedCart.items);
            } catch (error) {
                return notify(error.message, 'error');
            }
        } else {
            if (existingItem) {
                setCart(prev => prev.map(ci => ci.product._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci));
            } else {
                setCart(prev => [...prev, { product: item, quantity }]);
            }
        }
        notify(`Se agregó ${title} al carrito`, 'success');
    };

    const removeItem = async (productId) => {
        if (currentUser) {
            try {
                const updatedCart = await fetchFromApi(`/items/${productId}`, { method: 'DELETE' });
                setCart(updatedCart.items);
            } catch (error) {
                return notify(error.message, 'error');
            }
        } else {
            setCart(prev => prev.filter(item => item.product._id !== productId));
        }
        notify('Producto eliminado', 'success');
    };
    
    const updateQuantity = async (productId, newQuantity) => {
        const itemInCart = cart.find(i => i.product._id === productId);
        if (!itemInCart) return;

        if (newQuantity < 1) {
            return removeItem(productId);
        }
        if (newQuantity > itemInCart.product.stock) {
            return notify('Stock insuficiente', 'warning');
        }

        if (currentUser) {
            try {
                const updatedCart = await fetchFromApi(`/items/${productId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ quantity: newQuantity }),
                });
                setCart(updatedCart.items);
            } catch (error) {
                 notify(error.message, 'error');
            }
        } else {
            setCart(prev => prev.map(ci => ci.product._id === productId ? { ...ci, quantity: newQuantity } : ci));
        }
    };
    
    const increaseQuantity = (productId) => {
        const item = cart.find(i => i.product._id === productId);
        if (item) updateQuantity(productId, item.quantity + 1);
    };

    const decreaseQuantity = (productId) => {
        const item = cart.find(i => i.product._id === productId);
        if (item) updateQuantity(productId, item.quantity - 1);
    };

    const clearCart = async () => {
        if (currentUser) {
            try {
                await fetchFromApi('/', { method: 'DELETE' });
                setCart([]);
            } catch (error) {
                notify(error.message, 'error');
            }
        } else {
            setCart([]);
        }
    };

    const isInCart = (productId) => cart.some(item => item.product._id === productId);
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const getItemQuantity = (productId) => cart.find(i => i.product._id === productId)?.quantity || 0;

    const value = { cart, loading, addItem, removeItem, clearCart, isInCart, totalQuantity, totalAmount, increaseQuantity, decreaseQuantity, getItemQuantity };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;

