import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import { useCart } from '../context/CartContext';

const CartWidget = () => {
    const { totalQuantity } = useCart();

    return (
        <Container>
            <Link to='/cart' style={{ display: totalQuantity() > 0 ? 'block' : 'none' }}>
                <ButtonGroup>
                    <Button variant="outline-success">
                        <i className="bi bi-cart-fill"> </i>
                        <span className="badge rounded-pill bg-danger">{totalQuantity()}</span>
                    </Button>
                </ButtonGroup>
            </Link>
        </Container>
    );
};

export default CartWidget;