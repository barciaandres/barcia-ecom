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
        const { firestoreId, stock, title } = item;
        if (isInCart(firestoreId)) {
            const itemInCart = cart.find(cartItem => cartItem.firestoreId === firestoreId);
            if (itemInCart.quantity + quantity > stock) {
                notify(`No puedes agregar más items de los que hay en stock. Stock disponible: ${stock}, en carrito: ${itemInCart.quantity}.`, 'error')
                return;
            }
            setCart(prevCart => prevCart.map(cartItem => {
                if (cartItem.firestoreId === firestoreId) {
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

    const removeItem = (itemFirestoreId) => {
        setCart(prevCart => prevCart.filter(item => item.firestoreId !== itemFirestoreId));
        notify(`Producto eliminado del carrito`, 'success');
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (itemFirestoreId) => {
        return cart.some(item => item.firestoreId === itemFirestoreId);
    };

    const totalQuantity = () => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    const totalAmount = () => {
        const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        return parseFloat(total.toFixed(2));
    };

    const increaseQuantity = (itemFirestoreId) => {
        const itemInCart = cart.find(cartItem => cartItem.firestoreId === itemFirestoreId);
        if (itemInCart && itemInCart.quantity >= itemInCart.stock) {
            notify(`No puedes agregar más items de los que hay en stock. Stock disponible: ${itemInCart.stock}.`, 'error');
            return;
        }
        setCart(prevCart => prevCart.map(cartItem => {
            if (cartItem.firestoreId === itemFirestoreId) {
                return { ...cartItem, quantity: cartItem.quantity + 1 };
            }
            return cartItem;
        }));
    };

    const decreaseQuantity = (itemFirestoreId) => {
        const itemInCart = cart.find(cartItem => cartItem.firestoreId === itemFirestoreId);
        if (itemInCart && itemInCart.quantity <= 1) {
            return;
        }
        setCart(prevCart => prevCart.map(cartItem => {
            if (cartItem.firestoreId === itemFirestoreId) {
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
