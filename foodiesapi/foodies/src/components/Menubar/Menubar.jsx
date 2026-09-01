import { useContext, useEffect, useRef, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { fetchProfile } from "../../service/profileService";
const Menubar = () => {
  const {
    quantities,
    token,
    setToken,
    setQuantities
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // ==========================================
  // CART COUNT & SAFE ANIMATION TRIGGER
  // ==========================================
  const cartCount = Object.values(quantities || {})
      .filter((qty) => qty > 0)
      .length;
  // Track previous cart count to trigger animation safely without cascading synchronous effect setState
  const prevCartCountRef = useRef(cartCount);
  if (cartCount !== prevCartCountRef.current) {
    prevCartCountRef.current = cartCount;
    if (cartCount > 0) {
      // Defer state update using setTimeout to prevent synchronous cascading renders during render phase
      setTimeout(() => setCartAnimation(true), 0);
    }
  }
  // Effect only used for clearing the animation timer (no cascading setState on mount/dependency change)
  useEffect(() => {
    if (!cartAnimation) return;
    const timer = setTimeout(() => {
      setCartAnimation(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [cartAnimation]);
  // ==========================================
  // LOAD PROFILE
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      if (!token) {
        if (isMounted) setProfileImage("");
        return;
      }
      try {
        const profile = await fetchProfile(token);
        if (!isMounted) return;
        if (profile?.profileImageUrl) {
          const imageUrl = `${profile.profileImageUrl}${
              profile.profileImageUrl.includes("?") ? "&" : "?"
          }t=${Date.now()}`;
          setProfileImage(imageUrl);
        } else {
          setProfileImage("");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Unable to load profile:", error);
        setProfileImage("");
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [token]);
  // ==========================================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ==========================================
  // CLOSE DROPDOWN ON ROUTE CHANGE
  // ==========================================
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);
  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    setProfileImage("");
    setIsProfileOpen(false);
    navigate("/");
  };
  // ==========================================
  // ACTIVE LINK
  // ==========================================
  const isActive = (path) => {
    return location.pathname === path;
  };
  // ==========================================
  // PROFILE IMAGE ERROR
  // ==========================================
  const handleProfileImageError = () => {
    console.error("Profile image failed to load");
    setProfileImage("");
  };
  // ==========================================
  // TOGGLE DROPDOWN
  // ==========================================
  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };
  return (
      <nav className="food-navbar">
        <div className="container-fluid px-4">
          <div className="navbar-wrapper">
            {/* LOGO */}
            <Link to="/" className="navbar-brand">
              <img src={assets.logo} alt="Foodies" className="nav-logo" />
              <span className="brand-name">Foodies</span>
            </Link>
            {/* NAVIGATION */}
            <div className="nav-links">
              <Link
                  to="/"
                  className={isActive("/") ? "food-nav-link active-link" : "food-nav-link"}
              >
                Home
              </Link>
              <Link
                  to="/explore"
                  className={isActive("/explore") ? "food-nav-link active-link" : "food-nav-link"}
              >
                Explore
              </Link>
              <Link
                  to="/contact"
                  className={isActive("/contact") ? "food-nav-link active-link" : "food-nav-link"}
              >
                Contact
              </Link>
            </div>
            {/* RIGHT ACTIONS */}
            <div className="nav-actions">
              {/* CART */}
              <Link
                  to="/cart"
                  className={cartAnimation ? "cart-wrapper cart-animation" : "cart-wrapper"}
              >
                <img src={assets.cart} alt="cart" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              {/* LOGIN / REGISTER */}
              {!token ? (
                  <>
                    <button
                        type="button"
                        className="login-btn"
                        onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                    <button
                        type="button"
                        className="register-btn"
                        onClick={() => navigate("/register")}
                    >
                      Register
                    </button>
                  </>
              ) : (
                  /* PROFILE DROPDOWN */
                  <div className="profile-dropdown" ref={dropdownRef}>
                    <button
                        type="button"
                        className={isProfileOpen ? "profile-btn profile-btn-active" : "profile-btn"}
                        onClick={toggleProfileDropdown}
                        title="Account"
                        aria-expanded={isProfileOpen}
                    >
                      {profileImage ? (
                          <img
                              src={profileImage}
                              alt="Profile"
                              className="navbar-profile-image"
                              onError={handleProfileImageError}
                          />
                      ) : (
                          <img
                              src={assets.profile}
                              alt="Profile"
                              className="navbar-profile-image"
                          />
                      )}
                      <span className="profile-online-dot"></span>
                      <span className={isProfileOpen ? "profile-arrow profile-arrow-open" : "profile-arrow"}>
                        ▼
                      </span>
                    </button>
                    {/* DROPDOWN MENU */}
                    {isProfileOpen && (
                        <div className="profile-menu">
                          <div className="profile-menu-header">
                            <div className="profile-menu-avatar">
                              {profileImage ? (
                                  <img src={profileImage} alt="Profile" />
                              ) : (
                                  <img src={assets.profile} alt="Profile" />
                              )}
                            </div>
                            <div>
                              <strong>My Account</strong>
                              <span>Manage your account</span>
                            </div>
                          </div>
                          <div className="profile-menu-divider"></div>
                          <button
                              type="button"
                              className="profile-menu-item"
                              onClick={() => navigate("/profile")}
                          >
                            <span className="menu-icon profile-icon">👤</span>
                            <span className="menu-text">
                              <strong>My Profile</strong>
                              <small>View and edit profile</small>
                            </span>
                            <span className="menu-arrow">→</span>
                          </button>
                          <button
                              type="button"
                              className="profile-menu-item"
                              onClick={() => navigate("/myorders")}
                          >
                            <span className="menu-icon orders-icon">🛍️</span>
                            <span className="menu-text">
                              <strong>My Orders</strong>
                              <small>Track your orders</small>
                            </span>
                            <span className="menu-arrow">→</span>
                          </button>
                          <button
                              type="button"
                              className="profile-menu-item"
                              onClick={() => navigate("/favorites")}
                          >
                            <span className="menu-icon favorites-icon">❤️</span>
                            <span className="menu-text">
                              <strong>Favorites</strong>
                              <small>View your favorite foods</small>
                            </span>
                            <span className="menu-arrow">→</span>
                          </button>
                          <div className="profile-menu-divider"></div>
                          <button
                              type="button"
                              className="profile-menu-item logout-item"
                              onClick={logout}
                          >
                            <span className="menu-icon logout-icon">🚪</span>
                            <span className="menu-text">
                              <strong>Logout</strong>
                              <small>Sign out of your account</small>
                            </span>
                          </button>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};
export default Menubar;