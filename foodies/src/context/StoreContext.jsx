import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import {
  addToCart,
  getCartData,
  removeQtyFromCart
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const increaseQty = async (foodId) => {
    if (!token) {
      return false;
    }

    try {
      await addToCart(foodId, token);

      setQuantities((prev) => ({
        ...prev,
        [foodId]: (prev[foodId] || 0) + 1
      }));

      return true;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return false;
    }
  };

  const decreaseQty = async (foodId) => {
    if (!token || !quantities[foodId]) {
      return false;
    }

    try {
      await removeQtyFromCart(foodId, token);

      setQuantities((prev) => {
        const updated = { ...prev };
        const currentQty = updated[foodId] || 0;

        if (currentQty > 1) {
          updated[foodId] = currentQty - 1;
        } else {
          delete updated[foodId];
        }

        return updated;
      });

      return true;
    } catch (error) {
      console.error("Failed to decrease item quantity:", error);
      return false;
    }
  };

  const removeFromCart = async (foodId) => {
    if (!token || !quantities[foodId]) {
      return false;
    }

    try {
      const quantity = quantities[foodId];

      for (let i = 0; i < quantity; i++) {
        await removeQtyFromCart(foodId, token);
      }

      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[foodId];
        return updated;
      });

      return true;
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return false;
    }
  };

  const loadCartData = async (userToken) => {
    if (!userToken) {
      setQuantities({});
      return;
    }

    try {
      const items = await getCartData(userToken);
      setQuantities(items || {});
    } catch (error) {
      console.error("Failed to load cart:", error);
      setQuantities({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const foods = await fetchFoodList();
        setFoodList(foods || []);

        const savedToken = localStorage.getItem("token");

        if (savedToken) {
          setToken(savedToken);
          await loadCartData(savedToken);
        }
      } catch (error) {
        console.error("Failed to load application data:", error);
      }
    };

    loadData();
  }, []);

  const contextValue = {
    foodList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData
  };

  return (
      <StoreContext.Provider value={contextValue}>
        {children}
      </StoreContext.Provider>
  );
};