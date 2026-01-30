import { Container, Alert } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="mt-5">
      <Alert variant="info" className="text-center">
        <Alert.Heading>Nada por aquí!</Alert.Heading>
        <p>
          La página que estás buscando no existe.
        </p>
      </Alert>
    </Container>
  );
};

export default NotFound;