import {
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { fetchUserOrders } from "../../service/orderService";
import {
    saveFoodFeedback,
    fetchFoodFeedback,
} from "../../service/foodFeedbackService";
import "./MyOrders.css";
const MyOrders = () => {
    const { token } = useContext(StoreContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({});
    const [feedbackLoading, setFeedbackLoading] = useState({});
    // =========================================================
    // FETCH ORDERS
    // =========================================================
    const loadOrders = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetchUserOrders(token);
            setOrders(response || []);
        } catch (error) {
            console.error(
                "Order fetch error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };
    // =========================================================
    // FETCH FEEDBACK
    // =========================================================
    const loadFeedback = async (foodId) => {
        if (!foodId) {
            return;
        }
        try {
            const response =
                await fetchFoodFeedback(
                    foodId,
                    token
                );
            setFeedback((prev) => ({
                ...prev,
                [foodId]: {
                    rating:
                        response?.rating || 0,
                    // Keep internally if backend expects it,
                    // but DO NOT show Favorite in My Orders.
                    favorite:
                        response?.favorite || false,
                },
            }));
        } catch {
            setFeedback((prev) => ({
                ...prev,
                [foodId]: {
                    rating: 0,
                    favorite: false,
                },
            }));
        }
    };
    // =========================================================
    // LOAD ALL FEEDBACK
    // =========================================================
    const loadAllFeedback = async (orderList) => {
        const foodIds = new Set();
        orderList.forEach((order) => {
            order.orderedItems?.forEach((item) => {
                if (item.foodId) {
                    foodIds.add(item.foodId);
                }
            });
        });
        for (const foodId of foodIds) {
            await loadFeedback(foodId);
        }
    };
    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        const loadData = async () => {
            try {
                setLoading(true);
                const response =
                    await fetchUserOrders(token);
                const orderList =
                    response || [];
                setOrders(orderList);
                await loadAllFeedback(
                    orderList
                );
            } catch (error) {
                console.error(
                    "Order fetch error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token]);
    // =========================================================
    // AUTOMATIC ORDER REFRESH
    // =========================================================
    useEffect(() => {
        if (!token) {
            return;
        }
        const interval = setInterval(
            async () => {
                try {
                    const response =
                        await fetchUserOrders(
                            token
                        );
                    setOrders(
                        response || []
                    );
                } catch (error) {
                    console.error(
                        "Automatic order refresh error:",
                        error
                    );
                }
            },
            30000
        );
        return () => {
            clearInterval(interval);
        };
    }, [token]);
    // =========================================================
    // RATING
    // =========================================================
    const handleRating = async (
        foodId,
        rating
    ) => {
        if (!foodId) {
            return;
        }
        const previous =
            feedback[foodId] || {
                rating: 0,
                favorite: false,
            };
        // Optimistic UI update
        setFeedback((prev) => ({
            ...prev,
            [foodId]: {
                ...previous,
                rating,
            },
        }));
        setFeedbackLoading((prev) => ({
            ...prev,
            [foodId]: true,
        }));
        try {
            await saveFoodFeedback(
                {
                    foodId,
                    rating,
                    // Keep existing backend value.
                    // It is NOT displayed in My Orders.
                    favorite:
                    previous.favorite,
                },
                token
            );
        } catch (error) {
            console.error(
                "Rating save error:",
                error
            );
            setFeedback((prev) => ({
                ...prev,
                [foodId]:
                previous,
            }));
        } finally {
            setFeedbackLoading((prev) => ({
                ...prev,
                [foodId]: false,
            }));
        }
    };
    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-loading">
                    <div className="orders-loader"></div>
                    <span>
                        Loading orders... 🍔
                    </span>
                </div>
            </main>
        );
    }
    // =========================================================
    // PAGE
    // =========================================================
    return (
        <main className="orders-page">
            <div className="container py-5">
                <div className="orders-heading">
                    <div>
                        <h1 className="orders-title">
                            My Orders 🍔
                        </h1>
                        <p className="orders-subtitle">
                            Track your delicious orders and rate
                            the food you enjoyed.
                        </p>
                    </div>
                </div>
                {/* =================================================
                    EMPTY ORDERS
                ================================================= */}
                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-orders-icon">
                            <i className="bi bi-bag-x"></i>
                        </div>
                        <h3>
                            No orders yet
                        </h3>
                        <p>
                            Your delicious meals
                            will appear here.
                        </p>
                        <button
                            type="button"
                            className="browse-food-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Explore Food
                        </button>
                    </div>
                ) : (
                    <div className="orders-wrapper">
                        {orders.map(
                            (order, index) => (
                                <div
                                    className="order-card"
                                    key={
                                        order.id ||
                                        index
                                    }
                                >
                                    {/* =================================================
                                        LEFT - FOOD IMAGE
                                    ================================================= */}
                                    <div className="order-food-images">
                                        <img
                                            src={
                                                order
                                                    .orderedItems?.[0]
                                                    ?.imageUrl
                                            }
                                            alt={
                                                order
                                                    .orderedItems?.[0]
                                                    ?.name ||
                                                "Ordered food"
                                            }
                                            className="order-food-image"
                                        />
                                    </div>
                                    {/* =================================================
                                        CENTER
                                    ================================================= */}
                                    <div className="order-content">
                                        <div className="order-header">
                                            <div>
                                                <h3>
                                                    Order #{index + 1}
                                                </h3>
                                                <p>
                                                    {
                                                        order
                                                            .orderedItems
                                                            ?.length || 0
                                                    }{" "}
                                                    items
                                                </p>
                                            </div>
                                        </div>
                                        {/* =================================================
                                            FOOD ITEMS
                                        ================================================= */}
                                        <div className="order-items">
                                            {order.orderedItems?.map(
                                                (
                                                    item,
                                                    itemIndex
                                                ) => {
                                                    const foodId =
                                                        item.foodId;
                                                    const itemFeedback =
                                                        feedback[
                                                            foodId
                                                            ] || {
                                                            rating: 0,
                                                            favorite: false,
                                                        };
                                                    return (
                                                        <div
                                                            className="order-item"
                                                            key={
                                                                foodId ||
                                                                itemIndex
                                                            }
                                                        >
                                                            {/* FOOD DETAILS */}
                                                            <div className="order-item-details">
                                                                <div className="food-name-row">
                                                                    <h5>
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h5>
                                                                    <span className="food-quantity">
                                                                        ×{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <span className="food-price">
                                                                    ₹
                                                                    {Number(
                                                                        item.price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {/* =================================================
                                                                ONLY RATING
                                                                NO FAVORITE BUTTON
                                                            ================================================= */}
                                                            <div className="food-actions">
                                                                <div className="food-rating">
                                                                    <span className="rating-label">
                                                                        Rate
                                                                    </span>
                                                                    <div className="stars">
                                                                        {[1, 2, 3, 4, 5].map(
                                                                            (star) => (
                                                                                <button
                                                                                    type="button"
                                                                                    key={
                                                                                        star
                                                                                    }
                                                                                    className={`star ${
                                                                                        star <=
                                                                                        itemFeedback.rating
                                                                                            ? "active"
                                                                                            : ""
                                                                                    }`}
                                                                                    disabled={
                                                                                        feedbackLoading[
                                                                                            foodId
                                                                                            ]
                                                                                    }
                                                                                    onClick={() =>
                                                                                        handleRating(
                                                                                            foodId,
                                                                                            star
                                                                                        )
                                                                                    }
                                                                                    aria-label={`Rate ${star} stars`}
                                                                                >
                                                                                    ★
                                                                                </button>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    {/* =================================================
                                        RIGHT SIDE
                                    ================================================= */}
                                    <div className="order-right">
                                        <div className="order-total">
                                            ₹
                                            {Number(
                                                order.amount
                                            ).toFixed(2)}
                                        </div>
                                        <div
                                            className={`order-status ${
                                                order.orderStatus
                                                    ?.toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )
                                            }`}
                                        >
                                            ●{" "}
                                            {
                                                order.orderStatus ||
                                                "Confirmed"
                                            }
                                        </div>
                                        {/* TRACK ORDER */}
                                        {order.orderStatus !==
                                            "Delivered" && (
                                                <button
                                                    type="button"
                                                    className="track-order-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/track-order/${order.id}`
                                                        )
                                                    }
                                                >
                                                    🚚 Track Order
                                                </button>
                                            )}
                                        {/* VIEW DELIVERED ORDER */}
                                        {order.orderStatus ===
                                            "Delivered" && (
                                                <button
                                                    type="button"
                                                    className="track-order-btn delivered-track-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/track-order/${order.id}`
                                                        )
                                                    }
                                                >
                                                    📦 View Order
                                                </button>
                                            )}
                                        {/* REFRESH */}
                                        <button
                                            type="button"
                                            className="refresh-btn"
                                            onClick={
                                                loadOrders
                                            }
                                            title="Refresh orders"
                                            aria-label="Refresh orders"
                                        >
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};
export default MyOrders;