import { createContext, useContext } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
    return useContext(CartContext);
};

export default CartContext;
