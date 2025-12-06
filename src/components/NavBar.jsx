import { useState, useEffect } from "react";
import { getCategories } from "../firebase/db";
import { Link, NavLink } from "react-router-dom";
import CartWidget from "./CartWidget";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {
    const [categories, setCategories] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const closeMenu = () => setExpanded(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error obteniendo categorías:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Navbar
            expanded={expanded} // 3. Vincular el estado al Navbar
            expand="lg"
            bg="dark"
            data-bs-theme="dark"
            sticky="top"
            className="mb-4"
        >
            <Container fluid>
                <Navbar.Brand as={Link} to="/" onClick={closeMenu}>
                    Barcia-Ecom
                </Navbar.Brand>
                <Nav.Link as={Link} to="/cart" className="order-lg-last ms-auto me-2">
                    <CartWidget />
                </Nav.Link>
                <Navbar.Toggle
                    aria-controls="navbar-supported-content"
                    onClick={() => setExpanded(expanded ? false : "expanded")}
                />
                <Navbar.Collapse id="navbar-supported-content">
                    <Nav className="me-auto mb-2 mb-lg-0">
                        <Nav.Link as={Link} to="/" active onClick={closeMenu}>
                            Home
                        </Nav.Link>
                        <NavDropdown title="Categorías" id="basic-nav-dropdown">
                            {categories.map((category) => (
                                <NavDropdown.Item
                                    as={NavLink}
                                    key={category.id}
                                    to={`/categories/${category.slug}`}
                                    onClick={closeMenu}
                                >
                                    {category.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                        <Nav.Link as={Link} to="/orders" onClick={closeMenu}>
                            Ordenes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;