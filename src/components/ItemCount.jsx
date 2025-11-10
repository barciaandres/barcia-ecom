import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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

    return (
        <div>
            <ButtonGroup className="mb-2">
                <Button variant="secondary" onClick={decrement}>-</Button>
                <Button variant="light" disabled>{count}</Button>
                <Button variant="secondary" onClick={increment}>+</Button>
            </ButtonGroup>
            <br />
            <Button variant="primary" onClick={() => onAdd(count)} disabled={!stock}>
                Agregar al carrito
            </Button>
        </div>
    );
}

export default ItemCount;
