
import axios from "axios";
// =========================================================
// LOCAL SPRING BOOT BACKEND
// =========================================================
const API_URL = " https://food-delivery-project-2y1g.onrender.com/api/orders";
// =========================================================
// FETCH ALL ORDERS
// =========================================================
export const fetchAllOrders = async () => {
    console.log("==========================================");
    console.log("FETCHING ALL ORDERS");
    console.log("URL:", `${API_URL}/all`);
console.log("BACKEND: LOCALHOST");
console.log("==========================================");
try {
    const response = await axios.get(
        `${API_URL}/all`,
        {
            headers: {
                Accept: "application/json"
            }
        }
    );
    console.log(
        "ALL ORDERS RESPONSE:",
        response.data
    );
    return Array.isArray(response.data)
        ? response.data
        : [];
} catch (error) {
    console.error(
        "FETCH ALL ORDERS ERROR:",
        error
    );
    if (error.response) {
        console.error(
            "STATUS:",
            error.response.status
        );
        console.error(
            "RESPONSE:",
            error.response.data
        );
    }
    throw error;
}
};
// =========================================================
// UPDATE ORDER STATUS
// =========================================================
export const updateOrderStatus = async (
    orderId,
    status
) => {
    console.log("==========================================");
    console.log("UPDATING ORDER STATUS");
    console.log("ORDER ID:", orderId);
    console.log("STATUS:", status);
    console.log("==========================================");
    try {
        const response = await axios.patch(
            `${API_URL}/status/${orderId}`,
            null,
            {
                params: {
                    status: status
                },
                headers: {
                    Accept: "application/json"
                }
            }
        );
        console.log(
            "ORDER STATUS UPDATED:",
            response.status
        );
        return response.status >= 200 &&
            response.status < 300;
    } catch (error) {
        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );
        if (error.response) {
            console.error(
                "STATUS:",
                error.response.status
            );
            console.error(
                "RESPONSE:",
                error.response.data
            );
        }
        throw error;
    }
};
