import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItem = ({ name, description, id, imageUrl, price }) => {
    const { increaseQty, decreaseQty, quantities, token } = useContext(StoreContext);

    const handleAddToCart = async () => {
        if (!token) {
            toast.warning("Please login to add items to your cart.");
            return;
        }

        const success = await increaseQty(id);

        if (success) {
            toast.success("Added to cart 🛒");
        } else {
            toast.error("Unable to add item to cart.");
        }
    };

    const quantity = quantities[id] || 0;

    return (
        <article className="food-card">
            <Link to={`/food/${id}`} className="food-image-link">
                <div className="food-image-wrapper">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="food-image"
                        loading="lazy"
                    />
                    <div className="image-overlay">View Details</div>
                </div>
            </Link>

            <div className="food-content">
                <h3>{name}</h3>
                <p className="food-description">{description}</p>

                <div className="food-info">
                    <span className="food-price">₹{price}</span>
                    <div className="rating">
                        <i className="bi bi-star-fill"></i>
                        <span>4.5</span>
                    </div>
                </div>
            </div>

            <div className="food-actions">
                <Link to={`/food/${id}`} className="view-food-btn">
                    View
                </Link>

                {quantity > 0 ? (
                    <div className="quantity-box">
                        <button
                            type="button"
                            className="minus-btn"
                            onClick={() => decreaseQty(id)}
                            aria-label="Decrease quantity"
                        >
                            <i className="bi bi-dash"></i>
                        </button>

                        <span className="quantity-number">{quantity}</span>

                        <button
                            type="button"
                            className="plus-btn"
                            onClick={() => increaseQty(id)}
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