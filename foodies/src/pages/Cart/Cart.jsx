import {
    useContext,
    useState
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import {
    StoreContext
} from "../../context/StoreContext";
import {
    calculateCartTotals
} from "../../util/cartUtils";
import "./Cart.css";
const Cart = () => {
    const navigate = useNavigate();
    // =========================================================
    // STORE CONTEXT
    // =========================================================
    const {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart,
        // IMPORTANT:
        // StoreContext should provide this.
        // It tells Cart.jsx whether initial cart loading is finished.
        cartLoading
    } = useContext(StoreContext);
    // =========================================================
    // REMOVE STATE
    // =========================================================
    const [removingIds, setRemovingIds] = useState({});
    // =========================================================
    // SAFE DEFAULTS
    // =========================================================
    const safeFoodList = Array.isArray(foodList)
        ? foodList
        : [];
    const safeQuantities =
        quantities && typeof quantities === "object"
            ? quantities
            : {};
    // =========================================================
    // CART ITEMS
    // =========================================================
    const cartItems = safeFoodList.filter((food) => {
        const foodId = String(
            food.id ??
            food._id ??
            ""
        );
        const quantity =
            Number(
                safeQuantities[foodId]
            ) || 0;
        return quantity > 0;
    });
    // =========================================================
    // TOTALS
    // =========================================================
    const {
        subtotal,
        shipping,
        tax,
        total
    } = calculateCartTotals(
        cartItems,
        safeQuantities
    );
    // =========================================================
    // REMOVE ITEM
    // =========================================================
    const handleRemove = async (id) => {
        const foodId = String(id);
        setRemovingIds((previous) => ({
            ...previous,
            [foodId]: true
        }));
        try {
            await removeFromCart(id);
        } catch (error) {
            console.error(
                "Failed to remove cart item:",
                error
            );
        } finally {
            setRemovingIds((previous) => {
                const updated = {
                    ...previous
                };
                delete updated[foodId];
                return updated;
            });
        }
    };
    // =========================================================
    // LOADING
    // =========================================================
    if (cartLoading) {
        return (
            <main className="cart-page">
                <div className="container py-5">
                    <h1 className="cart-heading">
                        Your Cart 🛒
                    </h1>
                    <div className="cart-items-box">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                minHeight: "250px"
                            }}
                        >
                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                            <span className="ms-3">
                                Loading your cart...
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
    // =========================================================
    // RENDER
    // =========================================================
    return (
        <main className="cart-page">
            <div className="container py-5">
                <h1 className="cart-heading">
                    Your Cart 🛒
                </h1>
                <div className="row g-4">
                    {/* =================================================
                        CART ITEMS
                    ================================================= */}
                    <div className="col-lg-8">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <i className="bi bi-cart-x empty-cart-icon"></i>
                                <h3>
                                    Your cart is empty
                                </h3>
                                <p>
                                    Add tasty food items and enjoy your meal.
                                </p>
                                <Link
                                    to="/explore"
                                    className="continue-btn"
                                >
                                    Explore Food
                                </Link>
                            </div>
                        ) : (
                            <div className="cart-items-box">
                                {cartItems.map(
                                    (food, index) => {
                                        const foodId =
                                            String(
                                                food.id ??
                                                food._id ??
                                                ""
                                            );
                                        const quantity =
                                            Number(
                                                safeQuantities[foodId]
                                            ) || 0;
                                        return (
                                            <div
                                                key={foodId}
                                                className={
                                                    `cart-item ${
                                                        removingIds[foodId]
                                                            ? "cart-item-leaving"
                                                            : ""
                                                    }`
                                                }
                                                style={{
                                                    animationDelay:
                                                        `${index * 0.05}s`
                                                }}
                                            >
                                                {/* =================================================
                                                    IMAGE
                                                ================================================= */}
                                                <img
                                                    src={
                                                        food.imageUrl
                                                    }
                                                    alt={
                                                        food.name
                                                    }
                                                    className="cart-item-img"
                                                />
                                                {/* =================================================
                                                    DETAILS
                                                ================================================= */}
                                                <div className="cart-item-details">
                                                    <h5>
                                                        {food.name}
                                                    </h5>
                                                    <p>
                                                        {food.category}
                                                    </p>
                                                    <span>
                                                        ₹
                                                        {Number(
                                                            food.price
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                                {/* =================================================
                                                    QUANTITY
                                                ================================================= */}
                                                <div className="quantity-control">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQty(
                                                                foodId
                                                            )
                                                        }
                                                        disabled={
                                                            removingIds[
                                                                foodId
                                                                ]
                                                        }
                                                    >
                                                        −
                                                    </button>
                                                    <span>
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQty(
                                                                foodId
                                                            )
                                                        }
                                                        disabled={
                                                            removingIds[
                                                                foodId
                                                                ]
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                {/* =================================================
                                                    PRICE
                                                ================================================= */}
                                                <div className="cart-price-section">
                                                    <strong>
                                                        ₹
                                                        {(
                                                            Number(
                                                                food.price
                                                            ) *
                                                            quantity
                                                        ).toFixed(2)}
                                                    </strong>
                                                    <button
                                                        type="button"
                                                        className="remove-btn"
                                                        onClick={() =>
                                                            handleRemove(
                                                                foodId
                                                            )
                                                        }
                                                        disabled={
                                                            removingIds[
                                                                foodId
                                                                ]
                                                        }
                                                    >
                                                        {removingIds[
                                                            foodId
                                                            ] ? (
                                                            <span
                                                                className="spinner-border spinner-border-sm"
                                                                role="status"
                                                            />
                                                        ) : (
                                                            <i className="bi bi-trash"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                        {/* =================================================
                            CONTINUE SHOPPING
                        ================================================= */}
                        <Link
                            to="/"
                            className="continue-shopping"
                        >
                            <i className="bi bi-arrow-left"></i>
                            Continue Shopping
                        </Link>
                    </div>
                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}
                    <div className="col-lg-4">
                        <div className="cart-summary">
                            <h3>
                                Order Summary
                            </h3>
                            <div className="summary-row">
                                <span>
                                    Subtotal
                                </span>
                                <span>
                                    ₹
                                    {subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>
                                    Shipping
                                </span>
                                <span>
                                    ₹
                                    {subtotal === 0
                                        ? "0.00"
                                        : shipping.toFixed(2)
                                    }
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>
                                    Tax
                                </span>
                                <span>
                                    ₹
                                    {tax.toFixed(2)}
                                </span>
                            </div>
                            <hr />
                            <div className="total-row">
                                <strong>
                                    Total
                                </strong>
                                <strong className="total-amount">
                                    ₹
                                    {total.toFixed(2)}
                                </strong>
                            </div>
                            {/* =================================================
                                CHECKOUT
                            ================================================= */}
                            <button
                                type="button"
                                className="checkout-btn"
                                disabled={
                                    cartItems.length === 0
                                }
                                onClick={() =>
                                    navigate("/order")
                                }
                            >
                                Proceed To Checkout
                                <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default Cart;