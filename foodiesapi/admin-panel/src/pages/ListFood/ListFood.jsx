
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import {
    deleteFood,
    getFoodList
} from "../../services/foodService";
const ListFood = () => {
    const [list, setList] = useState([]);
    // Initial state is already loading.
    // Therefore useEffect does NOT need setLoading(true).
    const [loading, setLoading] = useState(true);
    // =========================================================
    // FETCH FOOD LIST
    // =========================================================
    const fetchList = async (showLoading = false) => {
        try {
            // Only show loading when manually refreshing
            // after deleting an item.
            if (showLoading) {
                setLoading(true);
            }
            console.log(
                "=========================================="
            );
            console.log(
                "FETCHING FOOD LIST"
            );
            const data = await getFoodList();
            console.log(
                "FOOD LIST RECEIVED:",
                data
            );
            if (Array.isArray(data)) {
                setList(data);
            } else {
                console.warn(
                    "Food API did not return an array:",
                    data
                );
                setList([]);
            }
        } catch (error) {
            console.error(
                "Food list error:",
                error
            );
            setList([]);
            toast.error(
                "Unable to load food items."
            );
        } finally {
            setLoading(false);
        }
    };
    // =========================================================
    // DELETE FOOD
    // =========================================================
    const removeFood = async (foodId) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this food item?"
            );
        if (!confirmDelete) {
            return;
        }
        try {
            console.log(
                "Deleting food:",
                foodId
            );
            const success =
                await deleteFood(foodId);
            if (success) {
                toast.success(
                    "Food deleted successfully."
                );
                // Refresh list after deletion.
                // showLoading = false means we don't hide
                // the entire table while refreshing.
                await fetchList(false);
            } else {
                toast.error(
                    "Unable to delete food."
                );
            }
        } catch (error) {
            console.error(
                "Delete food error:",
                error
            );
            toast.error(
                "Unable to delete food."
            );
        }
    };
    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        // loading is already true initially.
        // Therefore there is NO synchronous setState here.
        fetchList(false);
    }, []);
    // =========================================================
    // LOADING SCREEN
    // =========================================================
    if (loading) {
        return (
            <div className="container-fluid py-5">
                <div className="text-center">
                    <div
                        className="spinner-border"
                        role="status"
                        aria-label="Loading"
                    >
                    </div>
                    <p className="mt-3">
                        Loading food items...
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
            <div
                className="card food-card shadow-sm border-0"
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}
                <div className="food-header">
                    <div>
                        <h3 className="mb-1">
                            Food Menu
                        </h3>
                        <p className="mb-0">
                            Manage all food items available
                            in your restaurant
                        </p>
                    </div>
                    <span className="food-count">
                        {list.length} Items
                    </span>
                </div>
                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}
                <div className="table-responsive">
                    <table
                        className="table align-middle mb-0 food-table"
                    >
                        <thead>
                            <tr>
                                <th>
                                    Image
                                </th>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Category
                                </th>
                                <th>
                                    Price
                                </th>
                                <th className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? (
                                list.map((item) => (
                                    <tr
                                        key={item.id}
                                    >
                                        {/* IMAGE */}
                                        <td>
                                            <img
                                                src={
                                                    item.imageUrl
                                                }
                                                alt={
                                                    item.name
                                                }
                                                className="food-image"
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        </td>
                                        {/* NAME */}
                                        <td>
                                            <div className="fw-semibold">
                                                {item.name}
                                            </div>
                                        </td>
                                        {/* CATEGORY */}
                                        <td>
                                            <span
                                                className="category-badge"
                                            >
                                                {item.category}
                                            </span>
                                        </td>
                                        {/* PRICE */}
                                        <td className="price">
                                            ₹
                                            {Number(
                                                item.price || 0
                                            ).toFixed(2)}
                                        </td>
                                        {/* DELETE */}
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    removeFood(
                                                        item.id
                                                    )
                                                }
                                                title="Delete food"
                                            >
                                                <i
                                                    className="bi bi-trash-fill"
                                                >
                                                </i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="empty-state"
                                    >
                                        <i
                                            className="bi bi-basket display-4"
                                        >
                                        </i>
                                        <h5 className="mt-3">
                                            No Food Items Found
                                        </h5>
                                        <p>
                                            Start by adding your
                                            first food item.
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
export default ListFood;
