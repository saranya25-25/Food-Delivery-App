import { useState, useEffect } from "react";
import "./Menubar.css";

const Menubar = ({ toggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <nav className={`admin-navbar ${scrolled ? "navbar-shadow" : ""}`}>

        <div className="navbar-left">

          <button
              className="menu-btn"
              onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          <div>

            <h4 className="navbar-title">
              Foodies Admin
            </h4>

            <small className="navbar-subtitle">
              Food Delivery Management
            </small>

          </div>

        </div>

        <div className="navbar-center d-none d-lg-flex">

          <div className="search-box">

            <i className="bi bi-search"></i>

            <input
                type="text"
                placeholder="Search..."
            />

          </div>

        </div>

        <div className="navbar-right">

          <button className="icon-btn">

            <i className="bi bi-bell"></i>

            <span className="notification-dot"></span>

          </button>

          <button className="icon-btn">

            <i className="bi bi-gear"></i>

          </button>

          <div className="profile">

            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info d-none d-md-block">

              <h6>Admin</h6>

              <small>Administrator</small>

            </div>

          </div>

        </div>

      </nav>
  );
};

export default Menubar;