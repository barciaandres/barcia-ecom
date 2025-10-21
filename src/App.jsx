
import './App.css'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
function App() {
  const mensajeBienvenida = "Bienvenido a la tienda del Colo Barcia para vehículos";

  return (
    <>
      <NavBar />
      <ItemListContainer welcome={mensajeBienvenida} />
    </>
  );
}

export default App;
