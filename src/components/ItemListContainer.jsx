import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemList from './ItemList';
import { getProducts, getProductsByCategory } from '../firebase/db'

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
                const data = categoryId
                    ? await getProductsByCategory(categoryId)
                    : await getProducts();
                setProducts(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ItemList products={products} />
    );
}

export default ItemListContainer;