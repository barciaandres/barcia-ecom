import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<ItemListContainer />} />
        <Route path='/categories/:categoryId' element={<ItemListContainer />} />
      </Routes>
    </>
  );
}

export default App;
