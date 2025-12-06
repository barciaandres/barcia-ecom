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
                    <Col xs={6} md={4} lg={3} key={product.firestoreId}>
                        <Card className='mb-4'>
                            <Card.Img variant="top" src={product.thumbnail} />
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical'
                                }}>{product.title}</Card.Title>
                                <Card.Text style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {product.description}
                                </Card.Text>
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