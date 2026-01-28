import { useState, useEffect } from 'react';
import { getOrders } from '../firebase/db';
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
                const data = await getOrders(currentUser.uid);
                setOrders(data);
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
