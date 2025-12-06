import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../firebase/db';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function Checkout() {
    const { cart, totalAmount, totalQuantity, clearCart } = useCart();
    const [user, setUser] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const order = {
            buyer: user,
            items: cart,
            total: totalAmount()
        };

        try {
            const id = await createOrder(order);
            setOrderId(id);
            clearCart();
            Swal.fire({
                icon: 'success',
                title: '¡Orden creada!',
                text: `Tu número de orden es: ${id}`,
                // timer: 3000,
                // timerProgressBar: true,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear la orden',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (orderId) {
        return (
            <Container>
                <Row className="justify-content-md-center mt-4">
                    <Col md={6}>
                        <Card className="text-center">
                            <Card.Header as="h3">¡Gracias por tu compra!</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Tu número de orden es:
                                </Card.Text>
                                <Alert variant="success">
                                    <strong>{orderId}</strong>
                                </Alert>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    const quantity = totalQuantity();
    const amount = totalAmount();

    return (
        <Container>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header as="h3">Finalizar compra</Card.Header>
                        <Card.Body>
                            <Alert variant="light">
                                Estás comprando <strong>{quantity}</strong> producto(s) por un total de <strong>${amount}</strong>.
                            </Alert>
                            <Alert variant="info">
                                Para finalizar tu compra, por favor completa los siguientes datos.
                            </Alert>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" name="name" value={user.name} onChange={handleInputChange} placeholder="Ingresa tu nombre completo" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={user.email} onChange={handleInputChange} placeholder="ejemplo@correo.com" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="tel" name="phone" value={user.phone} onChange={handleInputChange} placeholder="1122334455" required />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={loading || cart.length === 0}>
                                        {loading ? 'Procesando...' : 'Crear Orden'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Checkout;
