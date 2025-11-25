import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeItem, clearCart, totalAmount } = useCart();

    if (cart.length === 0) {
        return (
            <Container className="mt-5">
                <h1>Tu carrito está vacío</h1>
                <Link to='/'>
                    <Button variant="primary">Volver a la tienda</Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1>Carrito de Compras</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity * item.price}</td>
                            <td>
                                <Button variant="danger" onClick={() => removeItem(item.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h3>Total: ${totalAmount()}</h3>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="danger" onClick={clearCart}>Vaciar Carrito</Button>
                <Button variant="success">Finalizar Compra</Button>
            </div>
        </Container>
    );
};

export default Cart;
