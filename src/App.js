import './App.css';
import Home from './components/home/Home';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login'
import ProtectedRoute from './components/utilites/ProtectedRoute';

import ErrorBoundary from './components/utilites/ErrorBoundary';
function App() {

  return (

    
  <Routes>
  <Route path="/" element={<Login />} />
  <Route element={<ProtectedRoute/>}>

      <Route element={<ErrorBoundary/>}>
      <Route path="/home" element={<Home />} />

      </Route>

  </Route>
</Routes>

   
   
  );
}

export default App;
