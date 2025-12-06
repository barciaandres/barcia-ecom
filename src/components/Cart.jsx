import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyCart from './EmptyCart';

const Cart = () => {
    const { cart, removeItem, clearCart, totalAmount } = useCart();

    if (cart.length === 0) {
        return <EmptyCart />;
    }

    return (
        <Container className="mt-5">
            <h1>Carrito de Compras</h1>
            <Table striped bordered hover responsive="sm">
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
                        <tr key={item.firestoreId} className="align-middle">
                            <td className="d-flex align-items-center">
                                <Image src={item.thumbnail} alt={item.title} style={{ width: '50px', minWidth: '50px' }} className="me-3" />
                                <span>{item.title}</span>
                            </td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${(item.quantity * item.price).toFixed(2)}</td>
                            <td>
                                <Button variant="danger" onClick={() => removeItem(item.firestoreId)}>
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
                <Link to="/checkout">
                    <Button variant="success">Finalizar Compra</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Cart;
