import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Container } from 'react-bootstrap';

function ItemCount({ stock, initial, onAdd }) {
    const [count, setCount] = useState(initial);

    const increment = () => {
        if (count < stock) {
            setCount(count + 1);
        }
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const handleAddToCart = () => {
        onAdd(count);
    };

    return (
        <Container>
            <ButtonGroup className="mb-2">
                <Button variant="secondary" onClick={decrement}>-</Button>
                <Button variant="light" disabled>{count}</Button>
                <Button variant="secondary" onClick={increment}>+</Button>
                <Button className="ms-2" variant="primary" onClick={handleAddToCart} disabled={!stock}>
                    Agregar al carrito
                </Button>
            </ButtonGroup>
        </Container >
    );
}

export default ItemCount;
