import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // cart state
  const [cart, setCart] = useState([]);
  // item amount state
  const [itemAmount, setItemAmount] = useState(0);
  // total price state
  const [total, setTotal] = useState(0);
  // customer Id
  const [customerId, setCustomerId] = useState(null);

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.user && decodedToken.user.customer_id) {
          setCustomerId(decodedToken.user.customer_id);
        } else {
          console.warn('Customer ID not found in token');
        }
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    } else {
      setCustomerId(null);
    }
  }, [token]);

  // fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      if (customerId) {
        try {
          const response = await axios.get('http://localhost:8000/api/cart/get', {
            params: { customer_id: customerId }
          });
          const cartItems = response.data.items;
          const productIds = cartItems.map(item => item.productId);
          const productDetails = await Promise.all(
            productIds.map(productId =>
              axios.get(`https://fakestoreapi.com/products/${productId}`)
            )
          );
          const productsWithAmount = cartItems.map(item => {
            const product = productDetails.find(p => p.data.id === item.productId);
            return {
              ...product.data,
              amount: item.amount
            };
          });
          setCart(productsWithAmount);
        } catch (e) {
          console.error('Failed to fetch cart:', e);
        }
      }
    };
    fetchCart();
  }, [customerId]);


  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(total);
  });

  // update item amount
  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  // add to cart
  const addToCart = async (product, id) => {
    const newItem = { ...product, amount: 1 };
    const cartItem = cart.find((item) => item.id === id);
    let newCart;

    if (cartItem) {
      newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else return item;
      });
    } else {
      newCart = [...cart, newItem];
    }
    setCart(newCart);
    await axios.post(`http://localhost:8000/api/cart/add`, {
      customer_id: customerId,
      items: newCart.map(item => ({ productId: item.id, amount: item.amount }))
    });
  };

  // cleart cart
  const clearCart = async () => {
    setCart([]);
    await axios.delete(`http://localhost:8000/api/cart/clear`, {
      params: { customer_id: customerId }
    });
  };

  // remove from cart
  const removeFromCart = async (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    await axios.delete(`http://localhost:8000/api/cart/remove/${id}`, {
      data: { customer_id: customerId }
    });
  };

  // increase amount
  const increaseAmount = async (id) => {
    const cartItem = cart.find((item) => item.id === id);
    await addToCart(cartItem, id);
  };

  // decrease amount
  const decreaseAmount = async (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
      if (cartItem.amount < 2) {
        await removeFromCart(id);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
