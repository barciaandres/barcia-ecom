import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const EmptyCart = () => {
    return (
        <Container className="mt-5">
            <h1>Tu carrito está vacío</h1>
            <Link to='/'>
                <Button variant="primary">Volver a la tienda</Button>
            </Link>
        </Container>
    );
};

export default EmptyCart;
