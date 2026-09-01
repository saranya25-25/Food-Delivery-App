
import {
    useEffect,
    useState,
    useCallback
} from "react";
import { StoreContext } from "./StoreContext";
import { fetchFoodList } from "../service/foodService";
import {
    addToCart,
    getCartData,
    removeQtyFromCart
} from "../service/cartService";
export const StoreContextProvider = ({ children }) => {
    // =========================================================
    // FOOD
    // =========================================================
    const [foodList, setFoodList] = useState([]);
    // =========================================================
    // CART
    // =========================================================
    const [quantities, setQuantities] = useState({});
    // =========================================================
    // CART LOADING
    // =========================================================
    const [cartLoading, setCartLoading] = useState(true);
    // =========================================================
    // TOKEN
    // =========================================================
    const [token, setToken] = useState(
        localStorage.getItem("token") ||
        localStorage.getItem("jwtToken") ||
        localStorage.getItem("accessToken") ||
        ""
    );
    // =========================================================
    // FAVORITES
    // =========================================================
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved =
                localStorage.getItem("foodiesFavorites");
            if (!saved) {
                return [];
            }
            const parsed =
                JSON.parse(saved);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed.map(
                (id) => String(id)
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
                        String(id) === normalizedId
                );
            let updatedFavorites;
            if (exists) {
                updatedFavorites =
                    previousFavorites.filter(
                        (id) =>
                            String(id) !== normalizedId
                    );
            } else {
                updatedFavorites = [
                    ...previousFavorites,
                    normalizedId
                ];
            }
            localStorage.setItem(
                "foodiesFavorites",
                JSON.stringify(updatedFavorites)
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
                String(id) === normalizedId
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
    // NORMALIZE CART
    // =========================================================
    const normalizeCart = useCallback((items) => {
        const normalizedCart = {};
        if (
            !items ||
            typeof items !== "object"
        ) {
            return normalizedCart;
        }
        Object.entries(items).forEach(
            ([id, quantity]) => {
                const normalizedId =
                    String(id);
                const normalizedQuantity =
                    Number(quantity) || 0;
                if (normalizedQuantity > 0) {
                    normalizedCart[
                        normalizedId
                    ] =
                        normalizedQuantity;
                }
            }
        );
        return normalizedCart;
    }, []);
    // =========================================================
    // LOAD CART DATA
    // =========================================================
    const loadCartData = useCallback(
        async (userToken) => {
            if (!userToken) {
                setQuantities({});
                return {};
            }
            try {
                console.log(
                    "===================================="
                );
                console.log(
                    "LOADING CART DATA"
                );
                console.log(
                    "===================================="
                );
                const items =
                    await getCartData(userToken);
                console.log(
                    "Cart received from backend:",
                    items
                );
                const normalizedItems =
                    normalizeCart(items);
                console.log(
                    "Normalized cart:",
                    normalizedItems
                );
                setQuantities(
                    normalizedItems
                );
                return normalizedItems;
            } catch (error) {
                console.error(
                    "Failed to load cart:",
                    error
                );
                setQuantities({});
                return {};
            }
        },
        [normalizeCart]
    );
    // =========================================================
    // REFRESH CART
    //
    // IMPORTANT:
    // ChefBot uses this after adding an item.
    // This guarantees that Cart.jsx receives the latest
    // backend cart before navigation.
    // =========================================================
    const refreshCart = useCallback(
        async () => {
            const currentToken =
                localStorage.getItem("token") ||
                localStorage.getItem("jwtToken") ||
                localStorage.getItem("accessToken") ||
                "";
            if (!currentToken) {
                console.warn(
                    "REFRESH CART: No token found"
                );
                setQuantities({});
                return {};
            }
            console.log(
                "===================================="
            );
            console.log(
                "REFRESHING CART FROM BACKEND"
            );
            console.log(
                "===================================="
            );
            try {
                setCartLoading(true);
                const cartItems =
                    await getCartData(
                        currentToken
                    );
                console.log(
                    "REFRESH CART - Backend response:",
                    cartItems
                );
                const normalizedCart =
                    normalizeCart(
                        cartItems
                    );
                console.log(
                    "REFRESH CART - Normalized:",
                    normalizedCart
                );
                setQuantities(
                    normalizedCart
                );
                // Keep token state synchronized
                setToken(
                    currentToken
                );
                return normalizedCart;
            } catch (error) {
                console.error(
                    "REFRESH CART ERROR:",
                    error
                );
                throw error;
            } finally {
                setCartLoading(false);
            }
        },
        [normalizeCart]
    );
    // =========================================================
    // INCREASE QUANTITY
    // =========================================================
    const increaseQty = async (foodId) => {
        if (!token) {
            console.warn(
                "Cannot add to cart. User is not logged in."
            );
            return false;
        }
        const normalizedId =
            String(foodId);
        try {
            // -------------------------------------------------
            // BACKEND FIRST
            // -------------------------------------------------
            await addToCart(
                foodId,
                token
            );
            // -------------------------------------------------
            // FRONTEND UPDATE
            // -------------------------------------------------
            setQuantities((previous) => ({
                ...previous,
                [normalizedId]:
                    (
                        Number(
                            previous[normalizedId]
                        ) || 0
                    ) + 1
            }));
            console.log(
                "Quantity increased:",
                normalizedId
            );
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
    // DECREASE QUANTITY
    // =========================================================
    const decreaseQty = async (foodId) => {
        if (!token) {
            return false;
        }
        const normalizedId =
            String(foodId);
        const currentQuantity =
            Number(
                quantities[normalizedId]
            ) || 0;
        if (currentQuantity <= 0) {
            return false;
        }
        try {
            // -------------------------------------------------
            // BACKEND FIRST
            // -------------------------------------------------
            await removeQtyFromCart(
                foodId,
                token
            );
            // -------------------------------------------------
            // FRONTEND UPDATE
            // -------------------------------------------------
            setQuantities((previous) => {
                const updated = {
                    ...previous
                };
                const current =
                    Number(
                        updated[normalizedId]
                    ) || 0;
                if (current > 1) {
                    updated[
                        normalizedId
                    ] =
                        current - 1;
                } else {
                    delete updated[
                        normalizedId
                    ];
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
    // REMOVE ENTIRE ITEM
    // =========================================================
    const removeFromCart = async (foodId) => {
        if (!token) {
            return false;
        }
        const normalizedId =
            String(foodId);
        const quantity =
            Number(
                quantities[normalizedId]
            ) || 0;
        if (quantity <= 0) {
            return false;
        }
        try {
            // -------------------------------------------------
            // REMOVE ALL QUANTITIES FROM BACKEND
            // -------------------------------------------------
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
            // -------------------------------------------------
            // REMOVE FROM FRONTEND
            // -------------------------------------------------
            setQuantities((previous) => {
                const updated = {
                    ...previous
                };
                delete updated[
                    normalizedId
                ];
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
    // INITIAL APPLICATION LOAD
    // =========================================================
    useEffect(() => {
        let isMounted = true;
        const loadApplicationData =
            async () => {
                console.log(
                    "===================================="
                );
                console.log(
                    "INITIAL APPLICATION LOAD"
                );
                console.log(
                    "===================================="
                );
                setCartLoading(true);
                try {
                    // =================================================
                    // GET TOKEN
                    // =================================================
                    const savedToken =
                        localStorage.getItem("token") ||
                        localStorage.getItem("jwtToken") ||
                        localStorage.getItem("accessToken") ||
                        "";
                    console.log(
                        "Initial token exists:",
                        !!savedToken
                    );
                    if (isMounted) {
                        setToken(
                            savedToken
                        );
                    }
                    // =================================================
                    // LOAD FOOD
                    // =================================================
                    const foodPromise =
                        fetchFoodList();
                    // =================================================
                    // LOAD CART
                    // =================================================
                    const cartPromise =
                        savedToken
                            ? getCartData(savedToken)
                            : Promise.resolve({});
                    // =================================================
                    // WAIT FOR BOTH
                    // =================================================
                    const [
                        foods,
                        cartItems
                    ] = await Promise.all([
                        foodPromise,
                        cartPromise
                    ]);
                    // =================================================
                    // FOOD
                    // =================================================
                    if (isMounted) {
                        console.log(
                            "Food list loaded:",
                            foods
                        );
                        setFoodList(
                            Array.isArray(foods)
                                ? foods
                                : []
                        );
                    }
                    // =================================================
                    // CART
                    // =================================================
                    const normalizedCart =
                        normalizeCart(
                            cartItems
                        );
                    if (isMounted) {
                        console.log(
                            "Initial cart loaded:",
                            normalizedCart
                        );
                        setQuantities(
                            normalizedCart
                        );
                    }
                } catch (error) {
                    console.error(
                        "Failed to load application data:",
                        error
                    );
                    if (isMounted) {
                        setFoodList([]);
                        setQuantities({});
                    }
                } finally {
                    if (isMounted) {
                        setCartLoading(false);
                        console.log(
                            "Initial application loading completed."
                        );
                    }
                }
            };
        loadApplicationData();
        return () => {
            isMounted = false;
        };
    }, [normalizeCart]);
    // =========================================================
    // CONTEXT VALUE
    // =========================================================
    const contextValue = {
        // -----------------------------------------------------
        // FOOD
        // -----------------------------------------------------
        foodList,
        // -----------------------------------------------------
        // CART
        // -----------------------------------------------------
        quantities,
        increaseQty,
        decreaseQty,
        removeFromCart,
        setQuantities,
        loadCartData,
        refreshCart,
        cartLoading,
        // -----------------------------------------------------
        // AUTH
        // -----------------------------------------------------
        token,
        setToken,
        // -----------------------------------------------------
        // FAVORITES
        // -----------------------------------------------------
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        // -----------------------------------------------------
        // HELPER
        // -----------------------------------------------------
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
