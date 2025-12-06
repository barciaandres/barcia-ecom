import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ItemCount from './ItemCount';
import { useCart } from '../context/CartContext';

function ItemDetail({ product }) {
    const { addItem, cart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleOnAdd = (quantity) => {
        addItem(product, quantity);
        setIsAdded(true);
    };

    if (!product) {
        return <div>Producto no encontrado.</div>;
    }

    const itemInCart = cart.find(item => item.firestoreId === product.firestoreId);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const availableStock = product.stock - quantityInCart;

    return (
        <Container>
            <Row>
                <Col lg={5}>
                    <Card>
                        <Card.Img variant="top" src={product.thumbnail} />
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{product.title}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Text>Precio: ${product.price}</Card.Text>
                            <Card.Text>Rating: {product.rating}/5</Card.Text>
                            <Card.Text>Stock: {product.stock}</Card.Text>
                            {quantityInCart > 0 && (
                                <Card.Text>En carrito: {quantityInCart}</Card.Text>
                            )}
                            {isAdded ? (
                                <>
                                    <Link to='/' className="mt-3 d-block">
                                        <Button variant="primary">Seguir comprando</Button>
                                    </Link>
                                    <Link to='/cart' className="mt-3 d-block">
                                        <Button variant="success">Revisar y terminar compra</Button>
                                    </Link>
                                </>
                            ) : (
                                availableStock > 0 ? (
                                    <ItemCount stock={availableStock} initial={1} onAdd={handleOnAdd} />
                                ) : (
                                    <Alert variant="warning">No hay más stock disponible para este producto.</Alert>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ItemDetail;
