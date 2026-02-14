import { Button, ButtonGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

function CartItemCount({ item }) {
    const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
    const productId = item.product._id;

    return (
        <ButtonGroup size="sm">
            <Button variant="outline-secondary" onClick={() => decreaseQuantity(productId)} disabled={item.quantity <= 1}>
                -
            </Button>
            <Button variant="light ms-1" disabled >
                <strong>{item.quantity}</strong>
            </Button>
            <Button variant="outline-success ms-1" onClick={() => increaseQuantity(productId)} disabled={item.quantity >= item.product.stock}>
                +
            </Button>
            <Button variant="outline-danger ms-2" onClick={() => removeItem(productId)}>
                <i className="bi bi-trash3"></i>
            </Button>
        </ButtonGroup>
    );
}

export default CartItemCount;
