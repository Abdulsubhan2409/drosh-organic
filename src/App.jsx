import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/CartContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Ingredients from '@/pages/Ingredients';
import Contact from '@/pages/Contact';
import Checkout from '@/pages/Checkout';
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import AdminLogin from '@/pages/admin/AdminLogin';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Messages from '@/pages/admin/Messages';
import Customers from '@/pages/admin/Customers';
import Settings from '@/pages/admin/Settings';
import WhatsAppButton from '@/components/WhatsAppButton';

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/ingredients" element={<Ingredients />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout" element={<Checkout />} />
    </Route>

    {/* Login sits OUTSIDE the admin layout */}
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="messages" element={<Messages />} />
      <Route path="customers" element={<Customers />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <WhatsAppButton />
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App