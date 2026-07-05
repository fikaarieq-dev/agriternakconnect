import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={
          <ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;