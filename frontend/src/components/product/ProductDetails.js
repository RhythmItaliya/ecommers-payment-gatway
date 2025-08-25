import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../../redux/cartAction';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistAction';
import { formatINRPrice } from '../../utils/currency';
import { BsBag, BsHeart } from 'react-icons/bs';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';
import axios from 'axios';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const { id } = useParams();

    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
                const data = response.data;

                if (data.success) {
                    setProduct(data.data);
                } else {
                    setError(data.error || 'Failed to fetch product');
                }
            } catch (err) {
                setError('Error fetching product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <section className="min-h-screen flex justify-center items-center bg-gray-50">
                <LoadingSpinner size="xl" variant="primary" text="Loading product..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen flex justify-center items-center bg-gray-50">
                <ErrorState error={error} onRetry={() => window.location.reload()} />
            </section>
        );
    }

    if (!product) {
        return (
            <section className="min-h-screen flex justify-center items-center bg-gray-50">
                <ErrorState
                    error="The product you're looking for doesn't exist."
                    onRetry={() => window.location.reload()}
                />
            </section>
        );
    }

    const { title, price, description, image, discount, salePrice, stock, category } = product;

    const isInWishlist = wishlistItems.some((item) => {
        const itemProductId = item.productId?.id || item.productId;
        return itemProductId === product.id || itemProductId === product._id;
    });

    const handleAddToCart = () => {
        const productId = product.id || product._id;
        if (productId) {
            dispatch(addToCart({ productId, quantity: 1 }));
        }
    };

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            const wishlistItem = wishlistItems.find((item) => {
                const itemProductId = item.productId?.id || item.productId;
                return itemProductId === product.id || itemProductId === product._id;
            });

            if (wishlistItem) {
                const removeId = wishlistItem.productId?.id || wishlistItem.productId;
                dispatch(removeFromWishlist(removeId));
            }
        } else {
            const productId = product.id || product._id;
            dispatch(addToWishlist(productId));
        }
    };

    return (
        <>
            <section className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="mb-8">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <a href="/" className="text-gray-700 hover:text-primary transition-colors">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <a
                                            href="/products"
                                            className="ml-1 text-gray-700 hover:text-primary transition-colors md:ml-2"
                                        >
                                            Products
                                        </a>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="ml-1 text-gray-500 md:ml-2">{category}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="bg-gray-100 p-8 flex items-center justify-center">
                                <div className="relative group">
                                    <img
                                        className="w-96 h-96 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        src={image}
                                        alt={title}
                                    />
                                    {discount > 0 && (
                                        <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                            -{Math.round((discount / price) * 100)}%
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 lg:p-12">
                                <div className="mb-4">
                                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                                        {category}
                                    </span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    {title}
                                </h1>

                                <div className="mb-8">
                                    {discount > 0 ? (
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl font-bold text-red-500">
                                                {formatINRPrice(salePrice)}
                                            </span>
                                            <span className="text-2xl text-gray-400 line-through">
                                                {formatINRPrice(price)}
                                            </span>
                                            <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                                                Save {formatINRPrice(discount)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-4xl font-bold text-red-500">{formatINRPrice(price)}</div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <span
                                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                            stock > 10
                                                ? 'bg-green-100 text-green-800'
                                                : stock > 0
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        ></span>
                                        {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-600 leading-relaxed text-base">{description}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={stock === 0}
                                        className={`flex-1 py-4 px-8 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 ${
                                            stock > 0 ? 'bg-blue-600 shadow-lg' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <BsBag size={20} />
                                        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>

                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`py-4 px-6 border-2 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 ${
                                            isInWishlist
                                                ? 'text-red-500 border-red-500 bg-red-50'
                                                : 'text-green-600 border-green-600 bg-green-50'
                                        }`}
                                    >
                                        <BsHeart size={20} className={isInWishlist ? 'fill-current' : ''} />
                                        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Stock Available</h4>
                                            <p className="text-gray-900 font-medium text-lg">{stock} units</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
