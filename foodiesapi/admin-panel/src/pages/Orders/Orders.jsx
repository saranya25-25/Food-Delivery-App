import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setOrders(response);
    } catch {
      toast.error("Unable to load orders.");
    }
  };

  const handleStatusChange = async (event, orderId) => {
    try {
      const success = await updateOrderStatus(orderId, event.target.value);

      if (success) {
        toast.success("Order status updated.");
        loadOrders();
      } else {
        toast.error("Failed to update order.");
      }
    } catch {
      toast.error("Failed to update order.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
      <div className="container-fluid py-4">

        <div className="orders-card">

          <div className="orders-header">

            <div>
              <h3>Customer Orders</h3>
              <p>Track and manage all customer orders.</p>
            </div>

            <span className="orders-count">
            {orders.length} Orders
          </span>

          </div>

          <div className="table-responsive">

            <table className="table orders-table align-middle mb-0">

              <thead>

              <tr>

                <th>Parcel</th>
                <th>Order Details</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>

              </tr>

              </thead>

              <tbody>

              {orders.length > 0 ? (

                  orders.map((order) => (

                      <tr key={order.id}>

                        <td>

                          <img
                              src={assets.parcel}
                              alt="Parcel"
                              className="parcel-image"
                          />

                        </td>

                        <td>

                          <div className="fw-semibold mb-1">

                            {order.orderedItems.map((item, index) => (
                                <span key={index}>
                            {item.name} × {item.quantity}
                                  {index !== order.orderedItems.length - 1 && ", "}
                          </span>
                            ))}

                          </div>

                          <small className="text-secondary">
                            {order.userAddress}
                          </small>

                        </td>

                        <td className="order-price">
                          ₹{order.amount.toFixed(2)}
                        </td>

                        <td>

                      <span className="items-badge">
                        {order.orderedItems.length} Items
                      </span>

                        </td>

                        <td>

                          <select
                              className="form-select order-status"
                              value={order.orderStatus}
                              onChange={(event) =>
                                  handleStatusChange(event, order.id)
                              }
                          >
                            <option value="Food Preparing">
                              🍳 Food Preparing
                            </option>

                            <option value="Out for delivery">
                              🚚 Out for Delivery
                            </option>

                            <option value="Delivered">
                              ✅ Delivered
                            </option>

                          </select>

                        </td>

                      </tr>

                  ))

              ) : (

                  <tr>

                    <td colSpan="5" className="empty-orders">

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