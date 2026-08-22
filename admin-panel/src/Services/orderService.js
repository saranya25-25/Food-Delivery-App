import axios from "axios";

// Base API URL
const API_URL = "https://foodies-backend-z67f.onrender.com/api/orders";

// Fetch all orders
export const fetchAllOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching orders:", error);
        throw error;
    }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(
            `${API_URL}/status/${orderId}`,
            null,
            {
                params: {
                    status,
                },
            }
        );

        return response.status === 200;
    } catch (error) {
        console.error("Error while updating order status:", error);
        throw error;
    }
};