import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function Register() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return setError('Las contraseñas no coinciden');
        }

        setError('');
        setLoading(true);

        try {
            await signup(email, password);
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                timer: 2000,
                timerProgressBar: true,
            });
            navigate('/login');
        } catch (error) {
            setError('Error al crear la cuenta. Inténtalo de nuevo.');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header as="h3">Registrarse</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Ingresa tu email" 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Contraseña" 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                                    <Form.Label>Confirmar Contraseña</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={passwordConfirm} 
                                        onChange={(e) => setPasswordConfirm(e.target.value)} 
                                        placeholder="Confirma la contraseña" 
                                        required 
                                    />
                                </Form.Group>
                                
                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Registrando...' : 'Registrarse'}
                                    </Button>
                                </div>
                            </Form>
                            <div className="mt-3 text-center">
                                ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
