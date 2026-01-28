import { useState, useEffect } from "react";
import { getCategories } from "../firebase/db";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartWidget from "./CartWidget";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import Swal from "sweetalert2";

const NavBar = () => {
    const [categories, setCategories] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const closeMenu = () => setExpanded(false);

    const handleLogout = async () => {
        closeMenu();
        try {
            await logout();
            Swal.fire({
                icon: 'info',
                title: 'Has cerrado sesión',
                timer: 2000,
                timerProgressBar: true,
            });
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cerrar la sesión.',
            });
        }
    };

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
            expanded={expanded}
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
                        <Nav.Link as={NavLink} to="/" activeclassname="active" onClick={closeMenu}>
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
                    </Nav>
                    <Nav className="ms-auto">
                        {currentUser ? (
                            <NavDropdown title={currentUser.email} id="user-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/orders" onClick={closeMenu}>Mis Órdenes</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" activeclassname="active" onClick={closeMenu}>
                                    Login
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/register" activeclassname="active" onClick={closeMenu}>
                                    Registrarse
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;