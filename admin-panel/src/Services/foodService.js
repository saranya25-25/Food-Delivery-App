
import axios from "axios";
// =========================================================
// BACKEND API
// =========================================================
const API_URL =
    "https://food-delivery-project-2y1g.onrender.com/api/foods";
// =========================================================
// GET FOOD LIST
// =========================================================
export const getFoodList = async () => {
    try {
        console.log(
            "=========================================="
        );
        console.log(
            "FETCHING FOOD LIST"
        );
        console.log(
            "URL:",
            API_URL
        );
        console.log(
            "ADMIN LOGIN:",
            "NOT REQUIRED"
        );
        console.log(
            "=========================================="
        );
        const response =
            await axios.get(
                API_URL
            );
        console.log(
            "FOOD LIST RESPONSE:",
            response.data
        );
        return Array.isArray(response.data)
            ? response.data
            : [];
    } catch (error) {
        console.error(
            "ERROR FETCHING FOOD LIST:",
            error
        );
        if (error.response) {
            console.error(
                "FOOD API STATUS:",
                error.response.status
            );
            console.error(
                "FOOD API RESPONSE:",
                error.response.data
            );
        }
        throw error;
    }
};
// =========================================================
// ADD FOOD
// =========================================================
// NO ADMIN LOGIN REQUIRED
// =========================================================
export const addFood = async (
    foodData,
    image
) => {
    try {
        if (!image) {
            throw new Error(
                "Food image is required."
            );
        }
        const formData =
            new FormData();
        formData.append(
            "food",
            JSON.stringify(foodData)
        );
        formData.append(
            "file",
            image
        );
        console.log(
            "=========================================="
        );
        console.log(
            "ADDING FOOD"
        );
        console.log(
            "URL:",
            API_URL
        );
        console.log(
            "ADMIN LOGIN:",
            "NOT REQUIRED"
        );
        console.log(
            "=========================================="
        );
        const response =
            await axios.post(
                API_URL,
                formData
            );
        console.log(
            "FOOD ADDED:",
            response.data
        );
        return response.data;
    } catch (error) {
        console.error(
            "ERROR ADDING FOOD:",
            error
        );
        if (error.response) {
            console.error(
                "ADD FOOD STATUS:",
                error.response.status
            );
            console.error(
                "ADD FOOD RESPONSE:",
                error.response.data
            );
        }
        throw error;
    }
};
// =========================================================
// DELETE FOOD
// =========================================================
// NO ADMIN LOGIN REQUIRED
// =========================================================
export const deleteFood = async (
    foodId
) => {
    try {
        console.log(
            "=========================================="
        );
        console.log(
            "DELETING FOOD"
        );
        console.log(
            "FOOD ID:",
            foodId
        );
        console.log(
            "ADMIN LOGIN:",
            "NOT REQUIRED"
        );
        console.log(
            "=========================================="
        );
        const response =
            await axios.delete(
                `${API_URL}/${foodId}`
);
console.log(
    "FOOD DELETE RESPONSE:",
    response.status
);
return (
    response.status === 200 ||
    response.status === 204
);
} catch (error) {
    console.error(
        "ERROR DELETING FOOD:",
        error
    );
    if (error.response) {
        console.error(
            "DELETE FOOD STATUS:",
            error.response.status
        );
        console.error(
            "DELETE FOOD RESPONSE:",
            error.response.data
        );
    }
    throw error;
}
};
