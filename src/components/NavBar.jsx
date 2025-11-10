import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartWidget from "./CartWidget";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://dummyjson.com/products/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="mb-4">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Barcia-Ecom</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-supported-content" />
                <Navbar.Collapse id="navbar-supported-content">
                    <Nav className="me-auto mb-2 mb-lg-0">
                        <Nav.Link as={Link} to="/" active>Home</Nav.Link>
                        <NavDropdown title="Categorías" id="basic-nav-dropdown">
                            {categories.map((category) => (
                                <NavDropdown.Item as={Link} key={category.slug} to={`/categories/${category.slug}`}>
                                    {category.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                    </Nav>
                    <Nav.Link as={Link} to="/cart">
                        <CartWidget />
                    </Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;