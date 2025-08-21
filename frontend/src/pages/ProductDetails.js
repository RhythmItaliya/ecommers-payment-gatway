import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartAction";
import { ProductContext } from "../contexts/ProductContext";

const ProductDetails = () => {
  // get the product id from url
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to find product from context first, then fetch from API if not found
  useEffect(() => {
    const findProduct = async () => {
      // First try to find in context
      let foundProduct = products.find((item) => item.id === parseInt(id));
      
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
        return;
      }

      // If not found in context, fetch from API
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products/${id}`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Product not found');
        }
        
        setProduct(result.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    findProduct();
  }, [id, products]);

  // Loading state
  if (loading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading product...</p>
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
    dispatch(addToCart(product));
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
                  <span className="text-2xl text-red-500 font-medium">${salePrice}</span>
                  <span className="text-lg text-gray-400 line-through">${price}</span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    -${discount} off
                  </span>
                </div>
              ) : (
                <div className="text-2xl text-red-500 font-medium">${price}</div>
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
