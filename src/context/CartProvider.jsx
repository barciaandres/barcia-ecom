import CartContext from './CartContext'
import { useState } from 'react'
import Swal from 'sweetalert2'


function CartProvider({ children }) {
    const [cart, setCart] = useState([])

    const addItem = (item, quantity) => {
        const { firestoreId, stock, title } = item;

        if (isInCart(firestoreId)) {
            const itemInCart = cart.find(cartItem => cartItem.firestoreId === firestoreId);
            if (itemInCart.quantity + quantity > stock) {
                Swal.fire({
                    icon: 'error',
                    title: 'Stock insuficiente',
                    text: `No puedes agregar más items de los que hay en stock. Stock disponible: ${stock}, en carrito: ${itemInCart.quantity}.`
                });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Stock insuficiente',
                    text: `No puedes agregar más items de los que hay en stock. Stock disponible: ${stock}.`
                });
                return;
            }
            setCart(prevCart => [...prevCart, { ...item, quantity }]);
        }

        Swal.fire({
            icon: 'success',
            title: '¡Agregado!',
            text: `Se ${quantity > 1 ? 'agregaron' : 'agregó'} ${quantity} ${quantity > 1 ? 'items' : 'item'} (${title}) al carrito`,
            showConfirmButton: false,
            timer: 2500
        });
    };

    const removeItem = (itemFirestoreId) => {
        setCart(prevCart => prevCart.filter(item => item.firestoreId !== itemFirestoreId));
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

    return <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, isInCart, totalQuantity, totalAmount }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider;
