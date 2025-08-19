import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Provider } from 'react-redux';
import store from './redux/store';

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import SidebarProvider from "./contexts/SidebarContext";
import ProductProvider from "./contexts/ProductContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import Checkout from "./card/Checkout";
import SuccessPage from "./pages/SuccessPage";
import AdminPanel from "./admin/AdminPanel";
import ToastContainer from "./components/Toast";

const stripePromise = loadStripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY')

// Component to conditionally render layout
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  if (isAdminRoute) {
    // Admin layout - no header, footer, or sidebar
    return (
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    );
  }

  // Regular app layout with header, footer, and sidebar
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
      <Sidebar />
      <Footer />
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <div className="overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <AuthProvider>
            <SidebarProvider>
              <ProductProvider>
                <Elements stripe={stripePromise}>
                  <Router>
                    <AppLayout />
                    <ToastContainer />
                  </Router>
                </Elements>
              </ProductProvider>
            </SidebarProvider>
          </AuthProvider>
        )}
      </div>
    </Provider>
  );
};

export default App;
