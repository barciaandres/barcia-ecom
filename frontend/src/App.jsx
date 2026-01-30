import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import NotFound from './components/NotFound.jsx'
import Cart from './components/Cart.jsx'
import Checkout from './components/Checkout.jsx'
import OrderListContainer from './components/OrderListContainer.jsx'
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<ItemListContainer />} />
        <Route path='/categories/:categoryId' element={<ItemListContainer />} />
        <Route path='/products/:productId' element={<ItemDetailContainer />} />
        <Route path='/cart' element={<Cart />} />
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/checkout' element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path='/orders' element={
          <ProtectedRoute>
            <OrderListContainer />
          </ProtectedRoute>
        } />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

