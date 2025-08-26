import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import store from './redux/store';

import ToastContainer from './components/ui/Toast';
import SidebarProvider from './contexts/SidebarContext';
import ProductProvider from './contexts/ProductContext';
import Sidebar from './cart/Sidebar';

import Header from './components/Header';
import Footer from './components/Footer';
import { LoadingSpinner } from './components/ui';

const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./components/product/ProductDetails'));
const Products = lazy(() => import('./pages/Products'));
const Wishlist = lazy(() => import('./components/profile/Wishlist'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const Checkout = lazy(() => import('./components/profile/Checkout'));
const RazorpayPayment = lazy(() => import('./components/profile/RazorpayPayment'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));

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
                                <Suspense fallback={<LoadingSpinner />}>
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
                                </Suspense>
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
