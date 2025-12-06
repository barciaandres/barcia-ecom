import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartProvider from './context/CartProvider.jsx';
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import NotFound from './components/NotFound.jsx'
import Cart from './components/Cart.jsx'
import Checkout from './components/Checkout.jsx'
import OrderListContainer from './components/OrderListContainer.jsx'

function App() {
  return (
    <CartProvider>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<ItemListContainer />} />
        <Route path='/categories/:categoryId' element={<ItemListContainer />} />
        <Route path='/products/:productId' element={<ItemDetailContainer />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orders' element={<OrderListContainer />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
