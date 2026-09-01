import axios from "axios";
const API_URL =
    "https://food-delivery-project-2y1g.onrender.com/api/cart";
// =========================================================
// ADD TO CART
// =========================================================
export const addToCart = async (
    foodId,
    token
) => {
    try {
        const response =
            await axios.post(
                API_URL,
                {
                    foodId: foodId
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        console.log(
            "ADD TO CART RESPONSE:",
            response.data
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error while adding cart data:",
            error
        );
        throw error;
    }
};
// =========================================================
// REMOVE ONE QUANTITY
// =========================================================
export const removeQtyFromCart = async (
    foodId,
    token
) => {
    try {
        const response =
            await axios.post(
                `${API_URL}/remove`,
                {
                    foodId: foodId
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        console.log(
            "REMOVE CART RESPONSE:",
            response.data
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error while removing quantity:",
            error
        );
        throw error;
    }
};
// =========================================================
// GET CART
// =========================================================
export const getCartData = async (
    token
) => {
    try {
        const response =
            await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        console.log(
            "GET CART RESPONSE:",
            response.data
        );
        return response.data?.items || {};
    } catch (error) {
        console.error(
            "Error while fetching cart data:",
            error
        );
        throw error;
    }
};
// =========================================================
// CLEAR CART
// =========================================================
export const clearCartItems = async (
    token,
    setQuantities
) => {
    try {
        await axios.delete(
            API_URL,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );
        setQuantities({});
    } catch (error) {
        console.error(
            "Error while clearing cart:",
            error
        );
        throw error;
    }
};