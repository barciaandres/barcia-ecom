import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import NotFound from './components/NotFound.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Cart from './components/Cart.jsx'

function App() {
  return (
    <CartProvider>
      <NavBar />
      <Routes>
        <Route path='/' element={<ItemListContainer />} />
        <Route path='/categories/:categoryId' element={<ItemListContainer />} />
        <Route path='/products/:productId' element={<ItemDetailContainer />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
