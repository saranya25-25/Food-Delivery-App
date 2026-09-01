import axios from "axios";
const API_URL = "http://localhost:8080/api/orders";
// =========================================================
// FETCH USER ORDERS
// =========================================================
export const fetchUserOrders = async (token) => {
    try {
        const response =
            await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        return response.data;
    } catch (error) {
        console.error(
            "Error occurred while fetching the orders",
            error
        );
        throw error;
    }
};
// =========================================================
// FETCH ONE ORDER
// =========================================================
export const fetchOrderById = async (
    orderId,
    token
) => {
    try {
        const response =
            await axios.get(
                `${API_URL}/${orderId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        return response.data;
    } catch (error) {
        console.error(
            "Error occurred while fetching order",
            error
        );
        throw error;
    }
};
// =========================================================
// CREATE ORDER
// =========================================================
export const createOrder = async (
    orderData,
    token
) => {
    try {
        const response =
            await axios.post(
                `${API_URL}/create`,
                orderData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        return response.data;
    } catch (error) {
        console.error(
            "Error occurred while creating the order",
            error
        );
        throw error;
    }
};
// =========================================================
// VERIFY PAYMENT
// =========================================================
export const verifyPayment = async (
    paymentData,
    token
) => {
    try {
        const response =
            await axios.post(
                `${API_URL}/verify`,
                paymentData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        return response.status === 200;
    } catch (error) {
        console.error(
            "Error occurred while verifying the payment",
            error
        );
        throw error;
    }
};
// =========================================================
// DELETE ORDER
// =========================================================
export const deleteOrder = async (
    orderId,
    token
) => {
    try {
        await axios.delete(
            `${API_URL}/${orderId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error(
            "Error occurred while deleting the order",
            error
        );
        throw error;
    }
};