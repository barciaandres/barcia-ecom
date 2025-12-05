import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../firebase/db'; // This function needs to be created
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Checkout() {
    const { cart, totalAmount, clearCart } = useCart();
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
                <h2>¡Gracias por tu compra!</h2>
                <p>Tu número de orden es: <strong>{orderId}</strong></p>
            </Container>
        );
    }

    return (
        <Container>
            <h2>Checkout</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="name" value={user.name} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={user.email} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="tel" name="phone" value={user.phone} onChange={handleInputChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Procesando...' : 'Crear Orden'}
                </Button>
            </Form>
        </Container>
    );
}

export default Checkout;
