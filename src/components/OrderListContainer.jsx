import { useState, useEffect } from 'react';
import { getOrders } from '../firebase/db';
import OrderList from './OrderList';
import { Spinner } from 'react-bootstrap';


function OrderListContainer() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando ordenes...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <OrderList orders={orders} />
    );
}

export default OrderListContainer;
