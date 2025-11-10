import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from './ItemDetail';

function ItemDetailContainer() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { productId } = useParams();

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`https://dummyjson.com/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return <div>Cargando Detalle del producto</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ItemDetail product={product} />
    );
}

export default ItemDetailContainer;
