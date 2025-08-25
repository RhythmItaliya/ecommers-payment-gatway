import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Provider } from 'react-redux';
import store from './redux/store';
import ToastContainer from './components/ui/Toast';

import Home from './pages/Home';
import ProductDetails from './components/product/ProductDetails';
import Products from './pages/Products';
import Wishlist from './components/profile/Wishlist';
import UserProfile from './components/profile/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import SidebarProvider from './contexts/SidebarContext';
import ProductProvider from './contexts/ProductContext';
import Sidebar from './cart/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Checkout from './components/profile/Checkout';
import RazorpayPayment from './components/profile/RazorpayPayment';
import SuccessPage from './pages/SuccessPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import About from './pages/About';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });

        const handleRouteChange = () => {
            AOS.refresh();
        };

        const timer = setTimeout(() => {
            AOS.refresh();
        }, 100);

        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            clearTimeout(timer);
        };
    }, []);

    return (
        <Provider store={store}>
            <AuthProvider>
                <SidebarProvider>
                    <ProductProvider>
                        <Router>
                            <ScrollToTop />
                            <div className="min-h-screen bg-gray-50">
                                <Header />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/product/:id" element={<ProductDetails />} />
                                    <Route path="/wishlist" element={<Wishlist />} />
                                    <Route path="/profile" element={<UserProfile />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/razorpay-payment" element={<RazorpayPayment />} />
                                    <Route path="/success" element={<SuccessPage />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                                <Sidebar />
                                <Footer />
                                <ToastContainer />
                            </div>
                        </Router>
                    </ProductProvider>
                </SidebarProvider>
            </AuthProvider>
        </Provider>
    );
};

export default App;
