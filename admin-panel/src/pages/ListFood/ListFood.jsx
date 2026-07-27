import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch {
      toast.error("Unable to load food items.");
    }
  };

  const removeFood = async (foodId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this food item?"
    );

    if (!confirmDelete) return;

    try {
      const success = await deleteFood(foodId);

      if (success) {
        toast.success("Food deleted successfully.");
        fetchList();
      } else {
        toast.error("Unable to delete food.");
      }
    } catch {
      toast.error("Unable to delete food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
      <div className="container-fluid py-4">

        <div className="card food-card shadow-sm border-0">

          <div className="food-header">

            <div>

              <h3 className="mb-1">Food Menu</h3>

              <p className="mb-0">
                Manage all food items available in your restaurant
              </p>

            </div>

            <span className="food-count">
            {list.length} Items
          </span>

          </div>

          <div className="table-responsive">

            <table className="table align-middle mb-0 food-table">

              <thead>

              <tr>

                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th className="text-center">Action</th>

              </tr>

              </thead>

              <tbody>

              {list.length > 0 ? (

                  list.map((item) => (

                      <tr key={item.id}>

                        <td>

                          <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="food-image"
                          />

                        </td>

                        <td>

                          <div className="fw-semibold">
                            {item.name}
                          </div>

                        </td>

                        <td>

                      <span className="category-badge">
                        {item.category}
                      </span>

                        </td>

                        <td className="price">
                          ₹{item.price}.00
                        </td>

                        <td className="text-center">

                          <button
                              className="delete-btn"
                              onClick={() => removeFood(item.id)}
                          >

                            <i className="bi bi-trash-fill"></i>

                          </button>

                        </td>

                      </tr>

                  ))

              ) : (

                  <tr>

                    <td colSpan="5" className="empty-state">

                      <i className="bi bi-basket display-4"></i>

                      <h5 className="mt-3">
                        No Food Items Found
                      </h5>

                      <p>
                        Start by adding your first food item.
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