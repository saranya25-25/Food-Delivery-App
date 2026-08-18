import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import { addToCart, getCartData, removeQtyFromCart } from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const increaseQty = async (foodId) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));

    await addToCart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    if (!token) return;

    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));

    await removeQtyFromCart(foodId, token);
  };

  const removeFromCart = (foodId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  };

  const loadCartData = async (userToken) => {
    if (!userToken) return;

    const items = await getCartData(userToken);
    if (items) {
      setQuantities(items);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const foods = await fetchFoodList();
      setFoodList(foods || []);

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
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
    loadCartData,
  };

  return (
      <StoreContext.Provider value={contextValue}>
        {props.children}
      </StoreContext.Provider>
  );
};