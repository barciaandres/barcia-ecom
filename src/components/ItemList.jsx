import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

function ItemList({ products }) {
    return (
        <Container>
            <Row>
                {products.map((product) => (
                    <Col lg={4} key={product.firestoreId}>
                        <Card className='mb-4'>
                            <Card.Img variant="top" src={product.thumbnail} />
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Button as={Link} to={`/products/${product.firestoreId}`} variant="primary">Ver producto</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ItemList;