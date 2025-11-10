import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Container } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

function ItemCount({ stock, initial }) {
    const [count, setCount] = useState(initial);
    const [showAlert, setShowAlert] = useState(false);

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
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 2500);
    };

    return (
        <Container>
            <ButtonGroup className="mb-2">
                <Button variant="secondary" onClick={decrement} disabled={showAlert} >-</Button>
                <Button variant="light" disabled>{count}</Button>
                <Button variant="secondary" onClick={increment} disabled={showAlert}>+</Button>
                <Button className="ms-2" variant="primary" onClick={handleAddToCart} disabled={!stock || showAlert}>
                    Agregar al carrito
                </Button>
            </ButtonGroup>
            {showAlert && (
                <Alert variant="success">
                    Agregando {count} productos al carrito...
                </Alert>
            )}
        </Container>
    );
}

export default ItemCount;
