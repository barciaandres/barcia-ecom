import CartContext from './CartContext'
import { useState, useEffect } from 'react'
import { notify } from '../utils/Notifications'

function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = window.localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            return [];
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error al guardar el carrito", error);
        }
    }, [cart]);
    const addItem = (item, quantity) => {
        const { id, stock, title } = item; // Use 'id' and 'title'
        if (isInCart(id)) { // Check if item is in cart by 'id'
            const itemInCart = cart.find(cartItem => cartItem.id === id); // Find by 'id'
            if (itemInCart.quantity + quantity > stock) {
                notify(`No puedes agregar más items de los que hay en stock. Stock disponible: ${stock}, en carrito: ${itemInCart.quantity}.`, 'error')
                return;
            }
            setCart(prevCart => prevCart.map(cartItem => {
                if (cartItem.id === id) { // Update by 'id'
                    return { ...cartItem, quantity: cartItem.quantity + quantity };
                }
                return cartItem;
            }));
        } else {
            if (quantity > stock) {
                notify(`No puedes agregar más items de los que hay en stock. Stock disponible: ${stock}.`, 'error')
                return;
            }
            setCart(prevCart => [...prevCart, { ...item, quantity }]);
        }
        notify(`Se ${quantity > 1 ? 'agregaron' : 'agregó'} ${quantity} ${quantity > 1 ? 'items' : 'item'} (${title}) al carrito`, 'success');
    };

    const removeItem = (id) => { // Use 'id' as parameter
        setCart(prevCart => prevCart.filter(item => item.id !== id)); // Filter by 'id'
        notify(`Producto eliminado del carrito`, 'success');
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (id) => { // Use 'id' as parameter
        return cart.some(item => item.id === id); // Check by 'id'
    };

    const totalQuantity = () => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    const totalAmount = () => {
        const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        return parseFloat(total.toFixed(2));
    };

    const increaseQuantity = (id) => { // Use 'id' as parameter
        const itemInCart = cart.find(cartItem => cartItem.id === id); // Find by 'id'
        if (itemInCart && itemInCart.quantity >= itemInCart.stock) {
            notify(`No puedes agregar más items de los que hay en stock. Stock disponible: ${itemInCart.stock}.`, 'error');
            return;
        }
        setCart(prevCart => prevCart.map(cartItem => {
            if (cartItem.id === id) { // Update by 'id'
                return { ...cartItem, quantity: cartItem.quantity + 1 };
            }
            return cartItem;
        }));
    };

    const decreaseQuantity = (id) => { // Use 'id' as parameter
        const itemInCart = cart.find(cartItem => cartItem.id === id); // Find by 'id'
        if (itemInCart && itemInCart.quantity <= 1) {
            return;
        }
        setCart(prevCart => prevCart.map(cartItem => {
            if (cartItem.id === id) { // Update by 'id'
                return { ...cartItem, quantity: cartItem.quantity - 1 };
            }
            return cartItem;
        }));
    };

    return <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, isInCart, totalQuantity, totalAmount, increaseQuantity, decreaseQuantity }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider;
