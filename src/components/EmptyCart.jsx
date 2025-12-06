import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const EmptyCart = () => {
    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="text-center p-4">
                        <Card.Body>
                            <div className="mb-4" style={{ fontSize: '4rem', color: '#6c757d' }}>
                                <i className="bi bi-cart-x"></i>
                            </div>
                            <Card.Title as="h2" className="mb-3">Tu carrito está vacío</Card.Title>
                            <Card.Text className="text-muted mb-4">
                                Parece que todavía no has agregado ningún producto a tu carrito.
                            </Card.Text>
                            <Link to='/'>
                                <Button variant="primary" size="lg">Explorar productos</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EmptyCart;
