import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyCart from './EmptyCart';
import CartItemCount from './CartItemCount';

const Cart = () => {
    const { cart, totalAmount, clearCart } = useCart();

    if (cart.length === 0) {
        return <EmptyCart />;
    }

    return (
        <Container className="mt-5">
            <h1>Carrito de Compras</h1>
            <Table striped bordered hover responsive="sm" size="sm">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th className="d-none d-md-table-cell">Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.product._id} className="align-middle">
                            <td className="d-flex align-items-center" style={{ minWidth: '150px' }}>
                                <Image src={item.product.thumbnail} alt={item.product.title} style={{ width: '40px', minWidth: '40px' }} className="me-2" />
                                <div className="d-flex flex-column">
                                    <span style={{ fontSize: '0.9rem' }}>{item.product.title}</span>
                                    <small className="d-md-none text-muted">${item.product.price}</small>
                                </div>
                            </td>
                            <td><CartItemCount item={item} /></td>
                            <td className="d-none d-md-table-cell">${item.product.price}</td>
                            <td className="fw-bold">${(item.quantity * item.product.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h3>Total: ${totalAmount.toFixed(2)}</h3>
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
