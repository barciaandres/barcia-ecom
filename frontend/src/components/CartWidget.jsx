import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useCart } from '../context/CartContext';

const CartWidget = () => {
    const { totalQuantity } = useCart();
    return (
        <ButtonGroup>
            {totalQuantity > 0 ? (
                <Button variant="outline-success">
                    <i className="bi bi-cart-fill"> </i>
                    <span className="badge rounded-pill bg-danger">{totalQuantity}</span>
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