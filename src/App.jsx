import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import NotFound from './components/NotFound.jsx'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<ItemListContainer />} />
        <Route path='/categories/:categoryId' element={<ItemListContainer />} />
        <Route path='/products/:productId' element={<ItemDetailContainer />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
