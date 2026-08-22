import axios from "axios";

const API_URL = "https://foodies-backend-z67f.onrender.com/api/food-feedback";

// SAVE / UPDATE FEEDBACK
export const saveFoodFeedback = async (feedback, token) => {
    const response = await axios.post(
        API_URL,
        feedback,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

// GET FEEDBACK
export const fetchFoodFeedback = async (foodId, token) => {
    const response = await axios.get(
        `${API_URL}/${foodId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// DELETE FEEDBACK
export const deleteFoodFeedback = async (foodId, token) => {
    await axios.delete(
        `${API_URL}/${foodId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};