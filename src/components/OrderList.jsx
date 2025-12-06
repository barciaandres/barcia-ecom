import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

function OrderList({ orders }) {
    if (orders.length === 0) {
        return <Container className="mt-5"><h2>No hay ordenes para mostrar.</h2></Container>;
    }

    return (
        <Container className="mt-5">
            <h1>Ordenes</h1>
            <Accordion defaultActiveKey="0">
                {orders.map((order, index) => (
                    <Accordion.Item eventKey={index.toString()} key={order.id}>
                        <Accordion.Header>
                            Orden ID: {order.id} - Fecha: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()} - Total: ${order.total}
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>Comprador:</h5>
                            <p>Nombre: {order.buyer.name}<br />
                                Email: {order.buyer.email}<br />
                                Teléfono: {order.buyer.phone}</p>
                            <h5>Items:</h5>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.firestoreId}>
                                            <td>{item.title}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
}

export default OrderList;
