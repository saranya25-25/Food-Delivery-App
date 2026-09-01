import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
const menuItems = [
  {
    title: "Add Food",
    icon: "bi-plus-circle-fill",
    path: "/add",
  },
  {
    title: "Food List",
    icon: "bi-grid-fill",
    path: "/list",
  },
  {
    title: "Orders",
    icon: "bi-bag-check-fill",
    path: "/orders",
  },
];
const Sidebar = ({ sidebarVisible }) => {
  const location = useLocation();
  return (
      <aside
          className={`sidebar ${
              sidebarVisible ? "sidebar-open" : "sidebar-close"
          }`}
      >
        {/* Logo */}
        <div className="sidebar-top">
          <img
              src={assets.logo}
              alt="Logo"
              className="sidebar-logo"
          />
          <h4 className="sidebar-title">
            Foodies
          </h4>
          <small className="sidebar-subtitle">
            Admin Panel
          </small>
        </div>
        {/* Navigation */}
        <div className="sidebar-menu">
          {menuItems.map((item) => (
              <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item ${
                      location.pathname === item.path ? "active" : ""
                  }`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.title}</span>
              </Link>
          ))}
        </div>
        {/* Footer */}
        <div className="sidebar-footer">
          <div className="version-box">
            <i className="bi bi-shield-check"></i>
            <span>Version 1.0</span>
          </div>
        </div>
      </aside>
  );
};
export default Sidebar;