import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./Favorites.css";

const Favorites = () => {
    const {
        foodList,
        favorites,
        toggleFavorite,
        isFavorite,
        getFoodId
    } = useContext(StoreContext);

    const favoriteFoods = foodList.filter((food) =>
        isFavorite(getFoodId(food))
    );

    const handleRemoveFavorite = (foodId) => {
        toggleFavorite(foodId);
        toast.info("Removed from favorites ❤️");
    };

    return (
        <main className="favorites-page">
            <div className="container py-5">
                <div className="favorites-header">
                    <h1>My Favorites ❤️</h1>
                    <p>Your favorite food items</p>
                </div>

                {favoriteFoods.length === 0 ? (
                    <div className="empty-favorites">
                        <div className="empty-heart">
                            <i className="bi bi-heart"></i>
                        </div>

                        <h3>No favorites yet</h3>

                        <p>
                            Add your favorite dishes and
                            they will appear here.
                        </p>

                        <Link
                            to="/explore"
                            className="explore-favorites-btn"
                        >
                            Explore Food
                        </Link>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favoriteFoods.map((food) => {
                            const foodId = getFoodId(food);

                            return (
                                <div
                                    className="favorite-card"
                                    key={foodId}
                                >
                                    <div className="favorite-image-wrapper">
                                        <img
                                            src={food.imageUrl}
                                            alt={food.name}
                                            className="favorite-food-image"
                                        />

                                        <button
                                            type="button"
                                            className="favorite-remove-btn"
                                            onClick={() =>
                                                handleRemoveFavorite(foodId)
                                            }
                                        >
                                            <i className="bi bi-heart-fill"></i>
                                        </button>
                                    </div>

                                    <div className="favorite-content">
                                        <h3>{food.name}</h3>

                                        <p className="favorite-category">
                                            {food.category}
                                        </p>

                                        <p className="favorite-description">
                                            {food.description}
                                        </p>

                                        <div className="favorite-bottom">
                                            <strong>
                                                ₹
                                                {Number(food.price).toFixed(2)}
                                            </strong>

                                            <Link
                                                to={`/food/${foodId}`}
                                                className="view-food-btn"
                                            >
                                                View Food
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Favorites;