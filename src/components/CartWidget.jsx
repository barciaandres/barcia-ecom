import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useCart } from '../context/CartContext';

const CartWidget = () => {
    const { totalQuantity } = useCart();

    return (
        <div style={{ display: totalQuantity() > 0 ? 'block' : 'none' }}>
            <ButtonGroup>
                <Button variant="outline-success">
                    <i className="bi bi-cart-fill"> </i>
                    <span className="badge rounded-pill bg-danger">{totalQuantity()}</span>
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default CartWidget;