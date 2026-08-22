import axios from "axios";

const API_URL = "https://foodies-backend-z67f.onrender.com/api/foods";

// Add Food
export const addFood = async (foodData, image) => {
    const formData = new FormData();

    formData.append("food", JSON.stringify(foodData));
    formData.append("file", image);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding food:", error);
        throw error;
    }
};

// Get All Foods
export const getFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching food list:", error);
        throw error;
    }
};

// Delete Food
export const deleteFood = async (foodId) => {
    try {
        const response = await axios.delete(`${API_URL}/${foodId}`);
        return response.status === 204 || response.status === 200;
    } catch (error) {
        console.error("Error deleting food:", error);
        throw error;
    }
};