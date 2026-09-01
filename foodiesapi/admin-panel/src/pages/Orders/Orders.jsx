
import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { assets } from "../../assets/assets";
import {
    fetchAllOrders,
    updateOrderStatus
} from "../../services/orderService";
import { toast } from "react-toastify";
import "./Orders.css";
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] =
        useState(null);
    // =========================================================
    // TRACK PAID ORDERS
    // =========================================================
    const previousPaidOrderIds = useRef(
        new Set()
    );
    const firstLoadCompleted = useRef(false);
    // =========================================================
    // PREVENT OVERLAPPING API REQUESTS
    // =========================================================
    const requestInProgress = useRef(false);
    // =========================================================
    // PLAY NEW ORDER SOUND
    // =========================================================
    const playNewOrderSound = useCallback(() => {
        try {
            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;
            if (!AudioContext) {
                console.warn(
                    "Web Audio API is not supported."
                );
                return;
            }
            const audioContext =
                new AudioContext();
            const playSound = async () => {
                try {
                    if (
                        audioContext.state ===
                        "suspended"
                    ) {
                        await audioContext.resume();
                    }
                    const oscillator =
                        audioContext.createOscillator();
                    const gainNode =
                        audioContext.createGain();
                    oscillator.type =
                        "sine";
                    // Three-note notification
                    oscillator.frequency.setValueAtTime(
                        880,
                        audioContext.currentTime
                    );
                    oscillator.frequency.setValueAtTime(
                        1046,
                        audioContext.currentTime + 0.15
                    );
                    oscillator.frequency.setValueAtTime(
                        1318,
                        audioContext.currentTime + 0.30
                    );
                    gainNode.gain.setValueAtTime(
                        0.0001,
                        audioContext.currentTime
                    );
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.5,
                        audioContext.currentTime + 0.03
                    );
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.0001,
                        audioContext.currentTime + 0.7
                    );
                    oscillator.connect(
                        gainNode
                    );
                    gainNode.connect(
                        audioContext.destination
                    );
                    oscillator.start();
                    oscillator.stop(
                        audioContext.currentTime + 0.7
                    );
                    oscillator.onended = () => {
                        audioContext.close();
                    };
                } catch (error) {
                    console.warn(
                        "Audio playback failed:",
                        error
                    );
                    try {
                        await audioContext.close();
                    } catch {
                        // Ignore close error
                    }
                }
            };
            playSound();
        } catch (error) {
            console.warn(
                "Unable to play order sound:",
                error
            );
        }
    }, []);
    // =========================================================
    // NOTIFY NEW ORDER
    // =========================================================
    const notifyNewOrder = useCallback(
        (newOrders) => {
            if (
                !newOrders ||
                newOrders.length === 0
            ) {
                return;
            }
          window.dispatchEvent(
              new CustomEvent("admin:new-paid-order", {
                detail: {
                  orders: newOrders
                }
              })
          );
            const count =
                newOrders.length;
            // Sound
            playNewOrderSound();
            // Toast
            toast.success(
                count === 1
                    ? "🔔 New paid order received!"
                    : `🔔 ${count} new paid orders received!`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true
                }
            );
            // Browser notification
            if (
                "Notification" in window &&
                Notification.permission ===
                    "granted"
            ) {
                try {
                    new Notification(
                        "🍔 New Food Order",
                        {
                            body:
                                count === 1
                                    ? "Payment completed. A new customer order has been received."
                                    : `${count} customer orders have been paid.`,
                            icon:
                                assets.parcel
                        }
                    );
                } catch (error) {
                    console.warn(
                        "Browser notification failed:",
                        error
                    );
                }
            }
        },
        [playNewOrderSound]
    );
    // =========================================================
    // REQUEST NOTIFICATION PERMISSION
    // =========================================================
    const requestNotificationPermission =
        useCallback(
            async () => {
                try {
                    if (
                        "Notification" in window &&
                        Notification.permission ===
                            "default"
                    ) {
                        await Notification.requestPermission();
                    }
                } catch (error) {
                    console.warn(
                        "Notification permission error:",
                        error
                    );
                }
            },
            []
        );
    // =========================================================
    // LOAD ORDERS
    // =========================================================
    const loadOrders = useCallback(
        async (checkForNewOrders = false) => {
            // Prevent overlapping requests
            if (requestInProgress.current) {
                return;
            }
            requestInProgress.current =
                true;
            try {
                const response =
                    await fetchAllOrders();
                const latestOrders =
                    Array.isArray(response)
                        ? response
                        : [];
                // =================================================
                // FIRST SUCCESSFUL LOAD
                // =================================================
                if (
                    !firstLoadCompleted.current
                ) {
                    const initialPaidOrderIds =
                        new Set(
                            latestOrders
                                .filter(
                                    (order) =>
                                        order.id &&
                                        String(
                                            order.paymentStatus || ""
                                        ).toLowerCase() ===
                                            "paid"
                                )
                                .map(
                                    (order) =>
                                        String(order.id)
                                )
                        );
                    previousPaidOrderIds.current =
                        initialPaidOrderIds;
                    firstLoadCompleted.current =
                        true;
                    setOrders(
                        latestOrders
                    );
                    return;
                }
                // =================================================
                // CHECK FOR NEW PAID ORDERS
                // =================================================
                if (
                    checkForNewOrders
                ) {
                    const newPaidOrders =
                        latestOrders.filter(
                            (order) => {
                                if (
                                    !order.id
                                ) {
                                    return false;
                                }
                                const paymentStatus =
                                    String(
                                        order.paymentStatus ||
                                        ""
                                    ).toLowerCase();
                                return (
                                    paymentStatus ===
                                        "paid" &&
                                    !previousPaidOrderIds.current
                                        .has(
                                            String(
                                                order.id
                                            )
                                        )
                                );
                            }
                        );
                    // Notify
                    if (
                        newPaidOrders.length > 0
                    ) {
                        notifyNewOrder(
                            newPaidOrders
                        );
                    }
                    // Update paid IDs
                    previousPaidOrderIds.current =
                        new Set(
                            latestOrders
                                .filter(
                                    (order) => {
                                        const paymentStatus =
                                            String(
                                                order.paymentStatus ||
                                                ""
                                            ).toLowerCase();
                                        return (
                                            order.id &&
                                            paymentStatus ===
                                                "paid"
                                        );
                                    }
                                )
                                .map(
                                    (order) =>
                                        String(
                                            order.id
                                        )
                                )
                        );
                }
                // =================================================
                // UPDATE TABLE
                // =================================================
                setOrders(
                    latestOrders
                );
            } catch (error) {
                console.error(
                    "Admin order fetch error:",
                    error
                );
                // Only show errors for manual/initial load.
                // Do not toast every 3 seconds.
                if (
                    !checkForNewOrders
                ) {
                    if (
                        error.response?.status ===
                        403
                    ) {
                        toast.error(
                            "Access denied. Check Spring Security order permissions."
                        );
                    } else {
                        toast.error(
                            "Unable to load customer orders."
                        );
                    }
                }
            } finally {
                setLoading(false);
                requestInProgress.current =
                    false;
            }
        },
        [notifyNewOrder]
    );
    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================
    const handleStatusChange = async (
        event,
        orderId
    ) => {
        const newStatus =
            event.target.value;
        try {
            setUpdatingOrder(
                orderId
            );
            const success =
                await updateOrderStatus(
                    orderId,
                    newStatus
                );
            if (success) {
                toast.success(
                    "Order status updated successfully."
                );
                setOrders(
                    (previousOrders) =>
                        previousOrders.map(
                            (order) =>
                                String(order.id) ===
                                String(orderId)
                                    ? {
                                        ...order,
                                        orderStatus:
                                            newStatus
                                    }
                                    : order
                        )
                );
            } else {
                toast.error(
                    "Failed to update order."
                );
            }
        } catch (error) {
            console.error(
                "Order status update error:",
                error
            );
            if (
                error.response?.status ===
                403
            ) {
                toast.error(
                    "Order status update is blocked by Spring Security."
                );
            } else {
                toast.error(
                    "Failed to update order."
                );
            }
        } finally {
            setUpdatingOrder(
                null
            );
        }
    };
    // =========================================================
    // INITIAL LOAD + POLLING
    // =========================================================
    useEffect(() => {
        let mounted = true;
        const startOrders = async () => {
            if (!mounted) {
                return;
            }
            await loadOrders(false);
            if (!mounted) {
                return;
            }
            await requestNotificationPermission();
        };
        startOrders();
        // Check for new paid orders every 5 seconds
        const orderPolling =
            setInterval(() => {
                if (mounted) {
                    loadOrders(true);
                }
            }, 5000);
        return () => {
            mounted = false;
            clearInterval(
                orderPolling
            );
        };
    }, [
        loadOrders,
        requestNotificationPermission
    ]);
    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="container-fluid py-5">
                <div className="text-center">
                    <div
                        className="spinner-border"
                        role="status"
                    >
                    </div>
                    <p className="mt-3">
                        Loading customer orders...
                    </p>
                </div>
            </div>
        );
    }
    // =========================================================
    // PAGE
    // =========================================================
    return (
        <div className="container-fluid py-4">
            <div className="orders-card">
                {/* HEADER */}
                <div className="orders-header">
                    <div>
                        <h3>
                            Customer Orders
                        </h3>
                        <p>
                            Track and manage all customer orders.
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="orders-count">
                            {orders.length} Orders
                        </span>
                        <span
                            className="badge bg-success"
                            title="Paid orders are checked every 5 seconds"
                        >
                            🟢 Live
                        </span>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                loadOrders(false)
                            }
                            title="Refresh orders"
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
                {/* TABLE */}
                <div className="table-responsive">
                    <table className="table orders-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>
                                    Parcel
                                </th>
                                <th>
                                    Order Details
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    Items
                                </th>
                                <th>
                                    Payment
                                </th>
                                <th>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map(
                                    (order) => (
                                        <tr
                                            key={
                                                order.id
                                            }
                                        >
                                            {/* PARCEL */}
                                            <td>
                                                <img
                                                    src={
                                                        assets.parcel
                                                    }
                                                    alt="Parcel"
                                                    className="parcel-image"
                                                />
                                            </td>
                                            {/* ORDER DETAILS */}
                                            <td>
                                                <div className="fw-semibold mb-1">
                                                    {Array.isArray(
                                                        order.orderedItems
                                                    ) &&
                                                        order.orderedItems.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        index
                                                                    }
                                                                >
                                                                    {
                                                                        item.name
                                                                    }{" "}
                                                                    ×{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                    {index !==
                                                                        order
                                                                            .orderedItems
                                                                            .length -
                                                                            1 &&
                                                                        ", "}
                                                                </span>
                                                            )
                                                        )}
                                                </div>
                                                <small className="text-secondary">
                                                    {
                                                        order.userAddress ||
                                                        "Address not available"
                                                    }
                                                </small>
                                                <br />
                                                <small className="text-secondary">
                                                    {
                                                        order.phoneNumber ||
                                                        "Phone not available"
                                                    }
                                                </small>
                                            </td>
                                            {/* AMOUNT */}
                                            <td className="order-price">
                                                ₹
                                                {Number(
                                                    order.amount ||
                                                    0
                                                ).toFixed(2)}
                                            </td>
                                            {/* ITEMS */}
                                            <td>
                                                <span className="items-badge">
                                                    {
                                                        Array.isArray(
                                                            order.orderedItems
                                                        )
                                                            ? order
                                                                .orderedItems
                                                                .length
                                                            : 0
                                                    }{" "}
                                                    Items
                                                </span>
                                            </td>
                                            {/* PAYMENT */}
                                            <td>
                                                <span
                                                    className={
                                                        `payment-badge ${
  String(
      order.paymentStatus ||
      ""
  ).toLowerCase() ===
  "paid"
      ? "paid"
      : "pending"
}`
                                                    }
                                                >
                                                    {
                                                        order.paymentStatus ||
                                                        "Pending"
                                                    }
                                                </span>
                                            </td>
                                            {/* STATUS */}
                                            <td>
                                                <select
                                                    className="form-select order-status"
                                                    value={
                                                        order.orderStatus ||
                                                        "Confirmed"
                                                    }
                                                    disabled={
                                                        updatingOrder ===
                                                        order.id
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleStatusChange(
                                                                event,
                                                                order.id
                                                            )
                                                    }
                                                >
                                                    <option value="Confirmed">
                                                        📦 Confirmed
                                                    </option>
                                                    <option value="Preparing">
                                                        🍳 Preparing
                                                    </option>
                                                    <option value="Out for Delivery">
                                                        🚚 Out for Delivery
                                                    </option>
                                                    <option value="Delivered">
                                                        ✅ Delivered
                                                    </option>
                                                </select>
                                                {updatingOrder ===
                                                    order.id && (
                                                    <small className="text-muted">
                                                        Updating...
                                                    </small>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty-orders"
                                    >
                                        <i className="bi bi-box-seam display-4"></i>
                                        <h5 className="mt-3">
                                            No Orders Available
                                        </h5>
                                        <p>
                                            Customer orders will appear here.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Orders;
