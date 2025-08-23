import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Checkout from "./card/Checkout";
import SuccessPage from "./pages/SuccessPage";

const stripePromise = loadStripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY')

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SidebarProvider>
          <ProductProvider>
            <Elements stripe={stripePromise}>
              <Router>
                <div className="min-h-screen bg-gray-50">
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
                </div>
              </Router>
            </Elements>
          </ProductProvider>
        </SidebarProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
