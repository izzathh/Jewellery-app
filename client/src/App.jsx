import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './router'
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App
