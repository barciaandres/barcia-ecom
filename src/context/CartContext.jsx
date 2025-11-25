import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addItem = (item, quantity) => {
        if (isInCart(item.id)) {
            setCart(prevCart => prevCart.map(cartItem => {
                if (cartItem.id === item.id) {
                    return { ...cartItem, quantity: cartItem.quantity + quantity };
                }
                return cartItem;
            }));
        } else {
            setCart(prevCart => [...prevCart, { ...item, quantity }]);
        }
    };

    const removeItem = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (itemId) => {
        return cart.some(item => item.id === itemId);
    };

    const totalQuantity = () => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    const totalAmount = () => {
        return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, isInCart, totalQuantity, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
