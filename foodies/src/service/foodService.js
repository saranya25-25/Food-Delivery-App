import axios from "axios";
import API_URL from "./api";
export const fetchFoodList = async () => {
    try {
        const response = await axios.get(`${API_URL}/foods`);
        return response.data;
    } catch (error) {
        console.error("Error fetching food list:", error);
        throw error;
    }
};
export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/foods/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching food details:", error);
        throw error;
    }
};