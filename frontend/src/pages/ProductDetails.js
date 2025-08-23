import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartAction";
import { formatINRPrice } from "../utils/currency";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProduct(data.products[0]); // Get first product for demo
        } else {
          setError('Failed to fetch product');
        }
      } catch (err) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  // if product is not found
  if (!product) {
    return (
      <section className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </section>
    );
  }

  // destructure product
  const { title, price, description, image, discount, salePrice, stock, category } = product;
  
  const handleAddToCart = () => {
    // Use the correct product ID for cart operations
    const productId = product.id || product._id;
    if (productId) {
      dispatch(addToCart({ productId, quantity: 1 }));
    }
  };
  
  return (
    <section className="pt-[450px] md:pt-32 pb-[400px] md:pb-12 lg:py-32 min-h-screen">
      <div className="container mx-auto px-4">
        {/* image and text wrapper */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* image */}
          <div className="flex flex-1 justify-center items-center mb-8 lg:mb-0">
            <img className="max-w-[300px] lg:max-w-md rounded-lg shadow-lg" src={image} alt={title} />
          </div>
          {/* text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">{category}</span>
            </div>
            <h1 className="text-[26px] font-medium mb-4 max-w-[450px] mx-auto lg:mx-0">{title}</h1>
            
            {/* Price display */}
            <div className="mb-6">
              {discount > 0 ? (
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="text-2xl text-red-500 font-medium">{formatINRPrice(salePrice)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatINRPrice(price)}</span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    -{formatINRPrice(discount)} off
                  </span>
                </div>
              ) : (
                <div className="text-2xl text-red-500 font-medium">{formatINRPrice(price)}</div>
              )}
            </div>

            {/* Stock info */}
            <div className="mb-4">
              <span className={`text-sm px-3 py-1 rounded-full ${
                stock > 10 ? 'bg-green-100 text-green-800' : 
                stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
              </span>
            </div>

            <p className="mb-8 text-gray-600 leading-relaxed">{description}</p>
            
            <button 
              onClick={handleAddToCart} 
              disabled={stock === 0}
              className={`py-4 px-8 text-white rounded-lg font-medium transition-colors ${
                stock > 0 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {stock > 0 ? 'Add to cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
