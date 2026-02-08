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

    const itemInCart = cart.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const availableStock = product.stock - quantityInCart;

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <Card as="article" className="shadow-sm">
                        <Row className="g-0">
                            <Col lg={5} className="d-flex justify-content-center align-items-center p-3">
                                <img src={product.thumbnail} alt={product.title} className="img-fluid rounded" />
                            </Col>
                            <Col lg={7}>
                                <Card.Body className="d-flex flex-column p-4 h-100">
                                    <Card.Title as="h2" className="mb-3">{product.title}</Card.Title>
                                    <Card.Text className="fs-4 mb-3">
                                        <strong>Precio:</strong> ${product.price}
                                    </Card.Text>
                                    {isAdded ? (
                                        <div className="d-grid gap-2 mt-auto">
                                            <Button as={Link} to='/' variant="primary" size="sm">Seguir comprando</Button>
                                            <Button as={Link} to='/cart' variant="success" size="sm">Revisar y terminar compra</Button>
                                        </div>
                                    ) : (
                                        availableStock > 0 ? (
                                            <ItemCount stock={availableStock} initial={1} onAdd={handleOnAdd} />
                                        ) : (
                                            <Alert variant="warning">No hay más stock disponible.</Alert>
                                        )
                                    )}
                                    {quantityInCart > 0 && (
                                        <Alert variant="info" className="mt-2 text-center">
                                            Ya tienes {quantityInCart} {quantityInCart === 1 ? 'unidad' : 'unidades'} en el carrito.
                                        </Alert>
                                    )}
                                    <hr className="my-4" />
                                    <Card.Text className="text-muted">{product.description}</Card.Text>
                                    <Container className='d-flex justify-content-between mt-3'>

                                        <Card.Text><small><strong>Stock:</strong> {product.stock}</small></Card.Text>
                                    </Container>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ItemDetail;
