import { Button, ButtonGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

function CartItemCount({ item }) {
    const { increaseQuantity, decreaseQuantity, removeItem } = useCart();

    return (
        <ButtonGroup size="sm">
            <Button variant="outline-secondary" onClick={() => decreaseQuantity(item.firestoreId)} disabled={item.quantity <= 1}>
                -
            </Button>
            <Button variant="light ms-1" disabled >
                <strong>{item.quantity}</strong>
            </Button>
            <Button variant="outline-success ms-1" onClick={() => increaseQuantity(item.firestoreId)} disabled={item.quantity >= item.stock}>
                +
            </Button>
            <Button variant="outline-danger ms-4" onClick={() => removeItem(item.firestoreId)}>
                <i className="bi bi-trash3"></i>
            </Button>
        </ButtonGroup>
    );
}

export default CartItemCount;
