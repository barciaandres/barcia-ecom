import './NavBar.css'
import CartWidget from './CartWidget.jsx'
import logo from '../assets/logo_barcia.png'
const NavBar = () => {
    return (
        <header className="navbar-header">
            <nav className="navbar-nav">
                <div className="navbar-brand">
                    <a href="#">
                        <img src={logo} alt="Barciaa" width="150px" height="auto"></img>
                    </a>
                </div>
                <ul className="navbar-links">
                    <li><a href="#" className="nav-link">Neumáticos</a></li>
                    <li><a href="#" className="nav-link">Accesorios</a></li>
                    <li><a href="#" className="nav-link">Repuestos</a></li>
                    <li><a href="#" className="nav-link">Servicios</a></li>
                </ul>
                <CartWidget />
            </nav>
        </header>
    );
};

export default NavBar;