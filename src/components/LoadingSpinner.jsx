import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
        </div>
    );
};

export default LoadingSpinner;