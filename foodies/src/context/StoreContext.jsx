import {
  createContext,
  useEffect,
  useState
} from "react";

import { fetchFoodList } from "../service/foodService";

import {
  addToCart,
  getCartData,
  removeQtyFromCart
} from "../service/cartService";


export const StoreContext =
    createContext(null);


export const StoreContextProvider = ({
                                       children
                                     }) => {


  // =========================================================
  // FOOD
  // =========================================================

  const [foodList, setFoodList] =
      useState([]);


  // =========================================================
  // CART
  // =========================================================

  const [quantities, setQuantities] =
      useState({});


  // =========================================================
  // TOKEN
  // =========================================================

  const [token, setToken] =
      useState(
          localStorage.getItem("token") || ""
      );


  // =========================================================
  // FAVORITES
  // =========================================================

  const [favorites, setFavorites] = useState(() => {

    try {

      const saved =
          localStorage.getItem(
              "foodiesFavorites"
          );


      if (!saved) {
        return [];
      }


      const parsed =
          JSON.parse(saved);


      if (!Array.isArray(parsed)) {
        return [];
      }


      // Always store IDs as strings
      return parsed.map((id) =>
          String(id)
      );


    } catch (error) {

      console.error(
          "Failed to load favorites:",
          error
      );

      return [];

    }

  });


  // =========================================================
  // GET FOOD ID
  // =========================================================

  const getFoodId = (food) => {

    if (!food) {
      return null;
    }


    return (
        food.id ??
        food._id ??
        null
    );

  };


  // =========================================================
  // TOGGLE FAVORITE
  // =========================================================

  const toggleFavorite = (foodId) => {

    if (
        foodId === null ||
        foodId === undefined
    ) {

      console.error(
          "Invalid food ID:",
          foodId
      );

      return;

    }


    const normalizedId =
        String(foodId);


    setFavorites((previousFavorites) => {


      const exists =
          previousFavorites.some(
              (id) =>
                  String(id) ===
                  normalizedId
          );


      let updatedFavorites;


      // -----------------------------------------------
      // REMOVE
      // -----------------------------------------------

      if (exists) {

        updatedFavorites =
            previousFavorites.filter(
                (id) =>
                    String(id) !==
                    normalizedId
            );

      }


          // -----------------------------------------------
          // ADD
      // -----------------------------------------------

      else {

        updatedFavorites = [
          ...previousFavorites,
          normalizedId
        ];

      }


      // -----------------------------------------------
      // SAVE TO LOCAL STORAGE
      // -----------------------------------------------

      localStorage.setItem(
          "foodiesFavorites",
          JSON.stringify(
              updatedFavorites
          )
      );


      console.log(
          "Updated favorites:",
          updatedFavorites
      );


      return updatedFavorites;

    });

  };


  // =========================================================
  // CHECK FAVORITE
  // =========================================================

  const isFavorite = (foodId) => {

    if (
        foodId === null ||
        foodId === undefined
    ) {

      return false;

    }


    const normalizedId =
        String(foodId);


    return favorites.some(
        (id) =>
            String(id) ===
            normalizedId
    );

  };


  // =========================================================
  // CLEAR FAVORITES
  // =========================================================

  const clearFavorites = () => {

    setFavorites([]);

    localStorage.removeItem(
        "foodiesFavorites"
    );

  };


  // =========================================================
  // INCREASE CART QUANTITY
  // =========================================================

  const increaseQty = async (foodId) => {

    if (!token) {

      return false;

    }


    try {

      await addToCart(
          foodId,
          token
      );


      setQuantities((previous) => ({

        ...previous,

        [foodId]:
            (previous[foodId] || 0) + 1

      }));


      return true;


    } catch (error) {

      console.error(
          "Failed to add item to cart:",
          error
      );


      return false;

    }

  };


  // =========================================================
  // DECREASE CART QUANTITY
  // =========================================================

  const decreaseQty = async (foodId) => {

    if (
        !token ||
        !quantities[foodId]
    ) {

      return false;

    }


    try {

      await removeQtyFromCart(
          foodId,
          token
      );


      setQuantities((previous) => {

        const updated = {
          ...previous
        };


        const currentQty =
            updated[foodId] || 0;


        if (currentQty > 1) {

          updated[foodId] =
              currentQty - 1;

        } else {

          delete updated[foodId];

        }


        return updated;

      });


      return true;


    } catch (error) {

      console.error(
          "Failed to decrease item quantity:",
          error
      );


      return false;

    }

  };


  // =========================================================
  // REMOVE CART ITEM COMPLETELY
  // =========================================================

  const removeFromCart = async (foodId) => {

    if (
        !token ||
        !quantities[foodId]
    ) {

      return false;

    }


    try {

      const quantity =
          quantities[foodId];


      for (
          let i = 0;
          i < quantity;
          i++
      ) {

        await removeQtyFromCart(
            foodId,
            token
        );

      }


      setQuantities((previous) => {

        const updated = {
          ...previous
        };


        delete updated[foodId];


        return updated;

      });


      return true;


    } catch (error) {

      console.error(
          "Failed to remove item from cart:",
          error
      );


      return false;

    }

  };


  // =========================================================
  // LOAD CART
  // =========================================================

  const loadCartData = async (
      userToken
  ) => {

    if (!userToken) {

      setQuantities({});

      return;

    }


    try {

      const items =
          await getCartData(
              userToken
          );


      setQuantities(
          items || {}
      );


    } catch (error) {

      console.error(
          "Failed to load cart:",
          error
      );


      setQuantities({});

    }

  };


  // =========================================================
  // LOAD FOOD + CART
  // =========================================================

  useEffect(() => {


    const loadData = async () => {

      try {


        // ---------------------------------------------
        // LOAD FOOD
        // ---------------------------------------------

        const foods =
            await fetchFoodList();


        console.log(
            "Food list:",
            foods
        );


        setFoodList(
            foods || []
        );


        // ---------------------------------------------
        // LOAD TOKEN
        // ---------------------------------------------

        const savedToken =
            localStorage.getItem(
                "token"
            );


        if (savedToken) {

          setToken(
              savedToken
          );


          // -----------------------------------------
          // LOAD CART
          // -----------------------------------------

          await loadCartData(
              savedToken
          );

        }


      } catch (error) {

        console.error(
            "Failed to load application data:",
            error
        );

      }

    };


    loadData();


  }, []);


  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const contextValue = {

    // FOOD
    foodList,


    // CART
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    setQuantities,
    loadCartData,


    // AUTH
    token,
    setToken,


    // FAVORITES
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,


    // HELPER
    getFoodId

  };


  // =========================================================
  // PROVIDER
  // =========================================================

  return (

      <StoreContext.Provider
          value={contextValue}
      >

        {children}

      </StoreContext.Provider>

  );

};