import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from './ItemDetail';
import LoadingSpinner from './LoadingSpinner';


function ItemDetailContainer() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { productId } = useParams();

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (<LoadingSpinner />);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ItemDetail product={product} />
    );
}

export default ItemDetailContainer;
