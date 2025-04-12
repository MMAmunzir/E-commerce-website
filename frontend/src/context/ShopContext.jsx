import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        const res = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: { Authorization: `Bearer ${token}` }, // Corrected header format
          } // Corrected headers
        );
        if (res.status === 200) {
          toast.success("Item added to cart successfully");
        } else {
          toast.error("Failed to add item to cart");
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to add item to cart");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.put(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          {
            headers: { Authorization: `Bearer ${token}` }, // Corrected header format
          }
        );

        toast.success("Item quantity updated successfully");
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to update item quantity in cart");
      }
    }
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };
  const getUserCarts = async (token) => {
    try {
      const res = await axios.get(backendUrl + "/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` }, // Corrected header format
      });
      if (res.status === 200) {
        setCartItems(res.data.payload);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch user cart data");
    }
  };

  useEffect(() => {}, [cartItems]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCarts(localStorage.getItem("token"));
    }
  }, []);
  const getProductsData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/all");
      if (res.status === 200) {
        setProducts(res.data.payload);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
