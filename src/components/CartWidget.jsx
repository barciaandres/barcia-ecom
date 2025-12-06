import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useCart } from '../context/CartContext';

const CartWidget = () => {
    const { totalQuantity } = useCart();
    const quantity = totalQuantity();

    return (
        <ButtonGroup>
            {quantity > 0 ? (
                <Button variant="outline-success">
                    <i className="bi bi-cart-fill"> </i>
                    <span className="badge rounded-pill bg-danger">{quantity}</span>
                </Button>
            ) : (
                <Button variant="outline-secondary">
                    <i className="bi bi-cart"></i>
                </Button>
            )}
        </ButtonGroup>
    );
};

export default CartWidget;