import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { fetchUserOrders } from "../../service/orderService";
import {
  saveFoodFeedback,
  fetchFoodFeedback
} from "../../service/foodFeedbackService";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState({});

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await fetchUserOrders(token);

      setOrders(response || []);
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH FEEDBACK
  // =========================================================

  const loadFeedback = async (foodId) => {
    try {
      const response = await fetchFoodFeedback(
          foodId,
          token
      );

      setFeedback((prev) => ({
        ...prev,
        [foodId]: {
          rating: response?.rating || 0,
          favorite: response?.favorite || false
        }
      }));
    } catch {
      setFeedback((prev) => ({
        ...prev,
        [foodId]: {
          rating: 0,
          favorite: false
        }
      }));
    }
  };

  // =========================================================
  // LOAD FEEDBACK FOR ALL ORDER ITEMS
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
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const response =
            await fetchUserOrders(token);

        const orderList = response || [];

        setOrders(orderList);

        await loadAllFeedback(orderList);
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
          favorite: false
        };

    setFeedback((prev) => ({
      ...prev,
      [foodId]: {
        ...previous,
        rating
      }
    }));

    setFeedbackLoading((prev) => ({
      ...prev,
      [foodId]: true
    }));

    try {
      await saveFoodFeedback(
          {
            foodId,
            rating,
            favorite: previous.favorite
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
        [foodId]: previous
      }));
    } finally {
      setFeedbackLoading((prev) => ({
        ...prev,
        [foodId]: false
      }));
    }
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const handleFavorite = async (
      foodId
  ) => {
    if (!foodId) {
      return;
    }

    const previous =
        feedback[foodId] || {
          rating: 0,
          favorite: false
        };

    const favorite =
        !previous.favorite;

    setFeedback((prev) => ({
      ...prev,
      [foodId]: {
        ...previous,
        favorite
      }
    }));

    setFeedbackLoading((prev) => ({
      ...prev,
      [foodId]: true
    }));

    try {
      await saveFoodFeedback(
          {
            foodId,
            rating: previous.rating,
            favorite
          },
          token
      );
    } catch (error) {
      console.error(
          "Favorite save error:",
          error
      );

      setFeedback((prev) => ({
        ...prev,
        [foodId]: previous
      }));
    } finally {
      setFeedbackLoading((prev) => ({
        ...prev,
        [foodId]: false
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
            Loading orders... 🍔
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

          <h1 className="orders-title">
            My Orders 🍔
          </h1>

          {orders.length === 0 ? (

              <div className="empty-orders">

                <i className="bi bi-bag-x"></i>

                <h3>
                  No orders yet
                </h3>

                <p>
                  Your delicious meals
                  will appear here.
                </p>

              </div>

          ) : (

              <div className="orders-wrapper">

                {orders.map((order, index) => (

                    <div
                        className="order-card"
                        key={
                            order.id || index
                        }
                    >

                      {/* =================================================
                                    LEFT
                                ================================================= */}

                      <div className="order-food-images">
                        <img
                            src={order.orderedItems[0]?.imageUrl}
                            alt={order.orderedItems[0]?.name}
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

                        {/* FOOD ITEMS */}

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
                                      favorite:
                                          false
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

                                      {/* RATING + FAVORITE */}

                                      <div className="food-actions">

                                        <div className="food-rating">

                                                                <span className="rating-label">
                                                                    Rate
                                                                </span>

                                          <div className="stars">

                                            {[1, 2, 3, 4, 5].map(
                                                (
                                                    star
                                                ) => (

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
                                                    >
                                                      ★
                                                    </button>

                                                )
                                            )}

                                          </div>

                                        </div>

                                        <button
                                            type="button"
                                            className={`favorite-btn ${
                                                itemFeedback.favorite
                                                    ? "active"
                                                    : ""
                                            }`}
                                            disabled={
                                              feedbackLoading[
                                                  foodId
                                                  ]
                                            }
                                            onClick={() =>
                                                handleFavorite(
                                                    foodId
                                                )
                                            }
                                        >

                                          <i
                                              className={
                                                itemFeedback.favorite
                                                    ? "bi bi-heart-fill"
                                                    : "bi bi-heart"
                                              }
                                          ></i>

                                          <span>
                                                                    {itemFeedback.favorite
                                                                        ? "Favorite"
                                                                        : "Favorite"}
                                                                </span>

                                        </button>

                                      </div>

                                    </div>

                                );
                              }
                          )}

                        </div>

                      </div>

                      {/* =================================================
                                    RIGHT
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
                            order.orderStatus
                          }

                        </div>

                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={
                              loadOrders
                            }
                            title="Refresh orders"
                        >

                          <i className="bi bi-arrow-clockwise"></i>

                        </button>

                      </div>

                    </div>

                ))}

              </div>

          )}

        </div>

      </main>
  );
};

export default MyOrders;