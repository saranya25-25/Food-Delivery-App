import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";
const FoodItem = ({
                      name,
                      description,
                      id,
                      imageUrl,
                      price
                  }) => {
    const {
        increaseQty,
        decreaseQty,
        quantities,
        token,
        isFavorite,
        toggleFavorite
    } = useContext(StoreContext);
    // =========================================================
    // FAVORITE STATUS
    // =========================================================
    const favorite = isFavorite
        ? isFavorite(id)
        : false;
    // =========================================================
    // ADD TO CART
    // =========================================================
    const handleAddToCart = async () => {
        if (!token) {
            toast.warning(
                "Please login to add items to your cart."
            );
            return;
        }
        const success = await increaseQty(id);
        if (success) {
            toast.success(
                "Added to cart 🛒"
            );
        } else {
            toast.error(
                "Unable to add item to cart."
            );
        }
    };
    // =========================================================
    // INCREASE QUANTITY
    // =========================================================
    const handleIncrease = async () => {
        if (!token) {
            toast.warning(
                "Please login to add items to your cart."
            );
            return;
        }
        const success =
            await increaseQty(id);
        if (!success) {
            toast.error(
                "Unable to update cart."
            );
        }
    };
    // =========================================================
    // DECREASE QUANTITY
    // =========================================================
    const handleDecrease = async () => {
        if (!token) {
            toast.warning(
                "Please login to modify your cart."
            );
            return;
        }
        await decreaseQty(id);
    };
    // =========================================================
    // TOGGLE FAVORITE
    // =========================================================
    const handleFavorite = (event) => {
        // Prevent the food card/link from being triggered
        event.preventDefault();
        event.stopPropagation();
        if (!isFavorite || !toggleFavorite) {
            return;
        }
        toggleFavorite(id);
        if (favorite) {
            toast.info(
                "Removed from favorites ❤️"
            );
        } else {
            toast.success(
                "Added to favorites ❤️"
            );
        }
    };
    // =========================================================
    // QUANTITY
    // =========================================================
    const quantity =
        quantities[id] || 0;
    // =========================================================
    // UI
    // =========================================================
    return (
        <article className="food-card">
            {/* =================================================
                FOOD IMAGE
            ================================================= */}
            <div className="food-image-container">
                <Link
                    to={`/food/${id}`}
                    className="food-image-link"
                >
                    <div className="food-image-wrapper">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="food-image"
                            loading="lazy"
                        />
                        <div className="image-overlay">
                            View Details
                        </div>
                    </div>
                </Link>
                {/* =================================================
                    FAVORITE BUTTON
                ================================================= */}
                <button
                    type="button"
                    className={
                        favorite
                            ? "food-favorite-btn favorite-active"
                            : "food-favorite-btn"
                    }
                    onClick={handleFavorite}
                    aria-label={
                        favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }
                    title={
                        favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }
                >
                    <i
                        className={
                            favorite
                                ? "bi bi-heart-fill"
                                : "bi bi-heart"
                        }
                    ></i>
                </button>
            </div>
            {/* =================================================
                FOOD CONTENT
            ================================================= */}
            <div className="food-content">
                <h3>
                    {name}
                </h3>
                <p className="food-description">
                    {description}
                </p>
                <div className="food-info">
                    <span className="food-price">
                        ₹{Number(price).toFixed(2)}
                    </span>
                    <div className="rating">
                        <i className="bi bi-star-fill"></i>
                        <span>
                            4.5
                        </span>
                    </div>
                </div>
            </div>
            {/* =================================================
                FOOD ACTIONS
            ================================================= */}
            <div className="food-actions">
                <Link
                    to={`/food/${id}`}
                    className="view-food-btn"
                >
                    View
                </Link>
                {/* =================================================
                    QUANTITY CONTROLS
                ================================================= */}
                {quantity > 0 ? (
                    <div className="quantity-box">
                        <button
                            type="button"
                            className="minus-btn"
                            onClick={handleDecrease}
                            aria-label="Decrease quantity"
                        >
                            <i className="bi bi-dash"></i>
                        </button>
                        <span className="quantity-number">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            className="plus-btn"
                            onClick={handleIncrease}
                            aria-label="Increase quantity"
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="add-cart-btn"
                        onClick={handleAddToCart}
                    >
                        <i className="bi bi-cart-plus"></i>
                        Add
                    </button>
                )}
            </div>
        </article>
    );
};
export default FoodItem;