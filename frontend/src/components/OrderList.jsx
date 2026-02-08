import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

function OrderList({ orders }) {
    if (orders.length === 0) {
        return <Container className="mt-5"><h2>No hay ordenes para mostrar.</h2></Container>;
    }

    return (
        <Container className="mt-5">
            <h1>Ordenes de compra</h1>
            <Accordion defaultActiveKey="0">
                {orders.map((order, index) => (
                    <Accordion.Item eventKey={index.toString()} key={order.id}>
                        <Accordion.Header>
                            Orden ID: {order.id} - Fecha: {new Date(order.date).toLocaleString('es-ES', { // Use order.date
                                dateStyle: 'long',
                                timeStyle: 'long'
                            })} - Total: ${order.total}
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>Comprador:</h5>
                            <p>Nombre: {order.name}<br />
                                Email: {order.email}<br />
                                Teléfono: {order.phone}</p>
                            <h5>Items:</h5>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>{order.products.map(item => ( // Compacted
                                        <tr key={item.productId._id}><td>{item.productId.title}</td><td>{item.quantity}</td><td>${item.price}</td></tr>
                                    ))}</tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
}

export default OrderList;
