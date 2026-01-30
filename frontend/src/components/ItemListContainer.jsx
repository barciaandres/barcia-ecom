import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import ItemList from './ItemList';
import LoadingSpinner from './LoadingSpinner';

function ItemListContainer() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchProducts = async () => {
            try {
                const url = categoryId
                    ? `/api/products/category/${categoryId}`
                    : '/api/products';

                const response = await fetch(url);

                if (!response.ok) {
                    // Si la categoría no se encuentra (404), mostrar un array vacío en lugar de un error.
                    if (response.status === 404) {
                        setProducts([]);
                    } else {
                        throw new Error(`Error del servidor: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setProducts(data);
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);


    if (loading) {
        return (<LoadingSpinner />);
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Alert variant="danger">
                    Error: {error.message}
                </Alert>
            </div>
        );
    }

    return (
        <ItemList products={products} />
    );
}

export default ItemListContainer;