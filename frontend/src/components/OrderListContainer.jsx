import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderList from './OrderList';
import LoadingSpinner from './LoadingSpinner';

function OrderListContainer() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        };

        setLoading(true);
        setError(null);

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        setOrders([]); // No orders found for the user
                    } else {
                        throw new Error(`Error del servidor: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]);

    if (loading) {
        return (
            <LoadingSpinner />
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
