import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import DomainPage from './pages/DomainPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import SellerOrders from './pages/SellerOrders';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domain/:domainKey" element={<DomainPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/checkout" element={
            <ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute role="buyer"><MyOrders /></ProtectedRoute>
          } />

          <Route path="/seller/dashboard" element={
            <ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/seller/add-product" element={
            <ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>
          } />
          <Route path="/seller/orders" element={
            <ProtectedRoute role="seller"><SellerOrders /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
