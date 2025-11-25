import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ItemCount from './ItemCount';
import { useCart } from '../context/CartContext';

function ItemDetail({ product }) {
    const [quantityAdded, setQuantityAdded] = useState(0);
    const { addItem } = useCart();

    const handleOnAdd = (quantity) => {
        setQuantityAdded(quantity);
        addItem(product, quantity);
    };

    if (!product) {
        return <div>Producto no encontrado.</div>;
    }

    return (
        <Container>
            <Row>
                <Col lg={6}>
                    <Card>
                        <Card.Img variant="top" src={product.thumbnail} />
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{product.title}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Text>Precio: ${product.price}</Card.Text>
                            <Card.Text>Rating: {product.rating}/5</Card.Text>
                            <Card.Text>Stock: {product.stock}</Card.Text>
                            {quantityAdded > 0 ? (
                                <Link to='/cart'>
                                    <Button variant="success">Terminar compra</Button>
                                </Link>
                            ) : (
                                <ItemCount stock={product.stock} initial={1} onAdd={handleOnAdd} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ItemDetail