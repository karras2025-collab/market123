import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { StoreDataProvider } from './context/StoreDataContext';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import CatalogPage from './pages/Catalog';
import ProductDetailsPage from './pages/ProductDetails';
import CartPage from './pages/Cart';

// Lazy load admin pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const Products = lazy(() => import('./admin/Products'));
const ProductForm = lazy(() => import('./admin/ProductForm'));
const Categories = lazy(() => import('./admin/Categories'));
const Orders = lazy(() => import('./admin/Orders'));
const Settings = lazy(() => import('./admin/Settings'));

// Loading component for admin
const AdminLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <StoreDataProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Store Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetailsPage /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={
                <Suspense fallback={<AdminLoader />}>
                  <AdminLogin />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<AdminLoader />}>
                  <AdminLayout />
                </Suspense>
              }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id" element={<ProductForm />} />
                <Route path="categories" element={<Categories />} />
                <Route path="orders" element={<Orders />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AdminProvider>
    </StoreDataProvider>
  );
}

export default App;