import {
    useContext,
    useEffect,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    fetchOrderById,
} from "../../service/orderService";
import {
    StoreContext,
} from "../../context/StoreContext";
import "./TrackOrder.css";
const TrackOrder = () => {
    const {
        id,
    } = useParams();
    const {
        token,
    } = useContext(
        StoreContext
    );
    const navigate =
        useNavigate();
    const [order, setOrder] =
        useState(null);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");
    const [remainingTime, setRemainingTime] =
        useState("");
    // =========================================================
    // FETCH ORDER
    // =========================================================
    const loadOrder = async () => {
        if (!token || !id) {
            return;
        }
        try {
            const response =
                await fetchOrderById(
                    id,
                    token
                );
            setOrder(
                response
            );
            setError("");
        } catch (error) {
            console.error(
                "Track order error:",
                error
            );
            setError(
                "Unable to load this order."
            );
        } finally {
            setLoading(false);
        }
    };
    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        if (
            token &&
            id
        ) {
            loadOrder();
        }
    }, [token, id]);
    // =========================================================
    // AUTO REFRESH
    // =========================================================
    useEffect(() => {
        if (!token || !id) {
            return;
        }
        const interval =
            setInterval(
                () => {
                    loadOrder();
                },
                30000
            );
        return () => {
            clearInterval(
                interval
            );
        };
    }, [token, id]);
    // =========================================================
    // COUNTDOWN
    // =========================================================
    useEffect(() => {
        if (
            !order?.estimatedDeliveryTime
        ) {
            return;
        }
        const calculateRemaining =
            () => {
                const deliveryTime =
                    new Date(
                        order.estimatedDeliveryTime
                    ).getTime();
                const now =
                    new Date().getTime();
                const difference =
                    deliveryTime -
                    now;
                if (
                    difference <= 0
                ) {
                    setRemainingTime(
                        "Arriving soon"
                    );
                    return;
                }
                const totalMinutes =
                    Math.floor(
                        difference /
                        (1000 * 60)
                    );
                const hours =
                    Math.floor(
                        totalMinutes / 60
                    );
                const minutes =
                    totalMinutes % 60;
                if (hours > 0) {
                    setRemainingTime(
                        `${hours}h ${minutes}m remaining`
                    );
                } else {
                    setRemainingTime(
                        `${minutes} min remaining`
                    );
                }
            };
        calculateRemaining();
        const interval =
            setInterval(
                calculateRemaining,
                1000
            );
        return () => {
            clearInterval(
                interval
            );
        };
    }, [
        order?.estimatedDeliveryTime
    ]);
    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <main className="track-order-page">
                <div className="track-loading">
                    <div className="track-loading-icon">
                        🚚
                    </div>
                    <h3>
                        Loading your order...
                    </h3>
                    <p>
                        Please wait.
                    </p>
                </div>
            </main>
        );
    }
    // =========================================================
    // ERROR
    // =========================================================
    if (
        error ||
        !order
    ) {
        return (
            <main className="track-order-page">
                <div className="track-error">
                    <div className="track-error-icon">
                        😕
                    </div>
                    <h3>
                        Order not found
                    </h3>
                    <p>
                        We couldn't load this order.
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/myorders"
                            )
                        }
                    >
                        ← Back to My Orders
                    </button>
                </div>
            </main>
        );
    }
    // =========================================================
    // STATUS
    // =========================================================
    const statuses = [
        {
            name: "Confirmed",
            icon: "✓",
            description:
                "Your order has been confirmed.",
        },
        {
            name: "Preparing",
            icon: "👨‍🍳",
            description:
                "Your food is being prepared.",
        },
        {
            name: "Out for Delivery",
            icon: "🛵",
            description:
                "Your order is on the way.",
        },
        {
            name: "Delivered",
            icon: "🏠",
            description:
                "Your order has been delivered.",
        },
    ];
    const currentStatusIndex =
        statuses.findIndex(
            (item) =>
                item.name ===
                order.orderStatus
        );
    const activeIndex =
        currentStatusIndex === -1
            ? 0
            : currentStatusIndex;
    // =========================================================
    // FORMAT TIME
    // =========================================================
    const formatTime = (
        value
    ) => {
        if (!value) {
            return "";
        }
        return new Date(
            value
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };
    // =========================================================
    // GET STATUS TIME
    // =========================================================
    const getStatusTime = (
        status
    ) => {
        switch (status) {
            case "Confirmed":
                return formatTime(
                    order.confirmedAt
                );
            case "Preparing":
                return formatTime(
                    order.preparingAt
                );
            case "Out for Delivery":
                return formatTime(
                    order.outForDeliveryAt
                );
            case "Delivered":
                return formatTime(
                    order.deliveredAt
                );
            default:
                return "";
        }
    };
    // =========================================================
    // PAGE
    // =========================================================
    return (
        <main className="track-order-page">
            <div className="container py-5">
                {/* =================================================
              BACK
          ================================================= */}
                <button
                    type="button"
                    className="back-orders-btn"
                    onClick={() =>
                        navigate(
                            "/myorders"
                        )
                    }
                >
                    ← My Orders
                </button>
                {/* =================================================
              MAIN CARD
          ================================================= */}
                <div className="track-card">
                    {/* =================================================
                HEADER
            ================================================= */}
                    <div className="track-header">
                        <div>
                            <p className="track-label">
                                ORDER TRACKING
                            </p>
                            <h1>
                                Track Your Order 🚚
                            </h1>
                            <p className="track-order-number">
                                Order #
                                {order.id}
                            </p>
                        </div>
                        <div
                            className={`track-status-badge ${
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
                                order.orderStatus
                            }
                        </div>
                    </div>
                    {/* =================================================
                ESTIMATED DELIVERY
            ================================================= */}
                    <div className="estimated-delivery">
                        <div className="estimated-icon">
                            🕐
                        </div>
                        <div className="estimated-content">
                <span>
                  Estimated Delivery
                </span>
                            <strong>
                                {formatTime(
                                    order.estimatedDeliveryTime
                                )}
                            </strong>
                            <small>
                                {order.orderStatus ===
                                "Delivered"
                                    ? "Order delivered successfully 🎉"
                                    : remainingTime}
                            </small>
                        </div>
                    </div>
                    {/* =================================================
                PROGRESS
            ================================================= */}
                    <div className="tracking-timeline">
                        {statuses.map(
                            (
                                step,
                                index
                            ) => {
                                const completed =
                                    index <
                                    activeIndex;
                                const current =
                                    index ===
                                    activeIndex;
                                return (
                                    <div
                                        className={`timeline-item ${
                                            completed
                                                ? "completed"
                                                : ""
                                        } ${
                                            current
                                                ? "current"
                                                : ""
                                        }`}
                                        key={
                                            step.name
                                        }
                                    >
                                        {/* LINE */}
                                        {index <
                                            statuses.length -
                                            1 && (
                                                <div
                                                    className={`timeline-line ${
                                                        index <
                                                        activeIndex
                                                            ? "line-completed"
                                                            : ""
                                                    }`}
                                                />
                                            )}
                                        {/* ICON */}
                                        <div className="timeline-icon">
                                            {completed
                                                ? "✓"
                                                : step.icon}
                                        </div>
                                        {/* CONTENT */}
                                        <div className="timeline-content">
                                            <h3>
                                                {
                                                    step.name
                                                }
                                            </h3>
                                            <p>
                                                {
                                                    step.description
                                                }
                                            </p>
                                            {(
                                                completed ||
                                                current
                                            ) && getStatusTime(
                                                step.name
                                            ) && (
                                                <span className="timeline-time">
                                  {getStatusTime(
                                      step.name
                                  )}
                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                    {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}
                    <div className="track-section">
                        <div className="section-heading">
                <span>
                  📍
                </span>
                            <h2>
                                Delivery Address
                            </h2>
                        </div>
                        <div className="address-box">
                            {order.userAddress}
                        </div>
                    </div>
                    {/* =================================================
                PHONE
            ================================================= */}
                    <div className="track-section">
                        <div className="section-heading">
                <span>
                  📞
                </span>
                            <h2>
                                Contact
                            </h2>
                        </div>
                        <div className="contact-box">
                            {order.phoneNumber}
                        </div>
                    </div>
                    {/* =================================================
                ITEMS
            ================================================= */}
                    <div className="track-section">
                        <div className="section-heading">
                <span>
                  🍔
                </span>
                            <h2>
                                Order Items
                            </h2>
                        </div>
                        <div className="track-items">
                            {order.orderedItems?.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        className="track-item"
                                        key={
                                            item.foodId ||
                                            index
                                        }
                                    >
                                        <div className="track-item-left">
                                            <img
                                                src={
                                                    item.imageUrl
                                                }
                                                alt={
                                                    item.name
                                                }
                                            />
                                            <div>
                                                <h4>
                                                    {
                                                        item.name
                                                    }
                                                </h4>
                                                <span>
                              Quantity ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                            </span>
                                            </div>
                                        </div>
                                        <strong>
                                            ₹
                                            {Number(
                                                item.price
                                            ).toFixed(2)}
                                        </strong>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    {/* =================================================
                TOTAL
            ================================================= */}
                    <div className="track-total">
              <span>
                Total Amount
              </span>
                        <strong>
                            ₹
                            {Number(
                                order.amount
                            ).toFixed(2)}
                        </strong>
                    </div>
                    {/* =================================================
                PAYMENT
            ================================================= */}
                    <div className="payment-info">
              <span>
                Payment Status
              </span>
                        <strong>
                            {order.paymentStatus ===
                            "Paid"
                                ? "✓ Paid"
                                : order.paymentStatus ||
                                "Pending"}
                        </strong>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default TrackOrder;