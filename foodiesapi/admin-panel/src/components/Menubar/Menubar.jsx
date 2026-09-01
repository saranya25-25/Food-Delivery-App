
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Menubar.css";
const Menubar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  // =========================================================
  // NOTIFICATIONS
  // =========================================================
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  // =========================================================
  // SETTINGS
  // =========================================================
  const [settingsOpen, setSettingsOpen] =
    useState(false);
  const [soundEnabled, setSoundEnabled] =
    useState(
      localStorage.getItem("adminSoundEnabled") !== "false"
    );
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] =
    useState(
      localStorage.getItem("adminBrowserNotifications") !== "false"
    );
  // =========================================================
  // REFS
  // =========================================================
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  // =========================================================
  // SCROLL EFFECT
  // =========================================================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener(
      "scroll",
      handleScroll
    );
    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);
  // =========================================================
  // LISTEN FOR NEW ORDER EVENTS
  // =========================================================
  useEffect(() => {
    const handleNewOrder = (event) => {
      const newOrders =
        event.detail?.orders || [];
      if (!newOrders.length) {
        return;
      }
      const createdAt =
        new Date().toISOString();
      const newNotifications =
        newOrders.map((order) => ({
          id:
            `${order.id}-${Date.now()}-${Math.random()}`,
          orderId:
            order.id,
          amount:
            Number(order.amount || 0),
          paymentStatus:
            order.paymentStatus || "Paid",
          createdAt,
          read: false
        }));
      setNotifications((previous) => [
        ...newNotifications,
        ...previous
      ].slice(0, 20));
    };
    window.addEventListener(
      "admin:new-paid-order",
      handleNewOrder
    );
    return () => {
      window.removeEventListener(
        "admin:new-paid-order",
        handleNewOrder
      );
    };
  }, []);
  // =========================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =========================================================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);
  // =========================================================
  // UNREAD COUNT
  // =========================================================
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;
  // =========================================================
  // MARK ALL AS READ
  // =========================================================
  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true
      }))
    );
  };
  // =========================================================
  // CLEAR NOTIFICATIONS
  // =========================================================
  const clearNotifications = () => {
    setNotifications([]);
  };
  // =========================================================
  // CLICK NOTIFICATION
  // =========================================================
  const openOrder = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              read: true
            }
          : item
      )
    );
    setNotificationOpen(false);
    navigate("/orders");
  };
  // =========================================================
  // SOUND SETTING
  // =========================================================
  const handleSoundToggle = () => {
    const newValue =
      !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem(
      "adminSoundEnabled",
      String(newValue)
    );
  };
  // =========================================================
  // BROWSER NOTIFICATION SETTING
  // =========================================================
  const handleBrowserNotificationToggle =
    async () => {
      if (!browserNotificationsEnabled) {
        if (
          "Notification" in window
        ) {
          if (
            Notification.permission ===
            "default"
          ) {
            const permission =
              await Notification.requestPermission();
            if (
              permission !==
              "granted"
            ) {
              return;
            }
          }
          if (
            Notification.permission !==
            "granted"
          ) {
            return;
          }
        }
      }
      const newValue =
        !browserNotificationsEnabled;
      setBrowserNotificationsEnabled(
        newValue
      );
      localStorage.setItem(
        "adminBrowserNotifications",
        String(newValue)
      );
    };
  // =========================================================
  // TEST NOTIFICATION
  // =========================================================
  const testNotification = () => {
    const testNotification = {
      id:
        `test-${Date.now()}`,
      orderId:
        "TEST-ORDER",
      amount:
        499,
      paymentStatus:
        "Paid",
      createdAt:
        new Date().toISOString(),
      read:
        false
    };
    setNotifications((previous) => [
      testNotification,
      ...previous
    ].slice(0, 20));
    setNotificationOpen(true);
  };
  // =========================================================
  // FORMAT TIME
  // =========================================================
  const formatTime = (dateString) => {
    const date =
      new Date(dateString);
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };
  // =========================================================
  // RENDER
  // =========================================================
  return (
    <nav
      className={`admin-navbar ${
  scrolled
      ? "navbar-shadow"
      : ""
}`}
    >
      {/* =====================================================
          LEFT
      ===================================================== */}
      <div className="navbar-left">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
          title="Toggle sidebar"
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
      {/* =====================================================
          SEARCH
      ===================================================== */}
      <div className="navbar-center d-none d-lg-flex">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search orders, food..."
          />
        </div>
      </div>
      {/* =====================================================
          RIGHT
      ===================================================== */}
      <div className="navbar-right">
        {/* ===================================================
            NOTIFICATION
        =================================================== */}
        <div
          className="navbar-dropdown-wrapper"
          ref={notificationRef}
        >
          <button
            className={`icon-btn ${
  unreadCount > 0
      ? "has-notification"
      : ""
}`}
            onClick={() => {
              setNotificationOpen(
                (previous) => !previous
              );
              setSettingsOpen(false);
            }}
            title="Notifications"
          >
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>
          {/* =================================================
              NOTIFICATION PANEL
          ================================================= */}
          {notificationOpen && (
            <div className="notification-panel">
              <div className="notification-header">
                <div>
                  <h6>
                    Notifications
                  </h6>
                  <small>
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You're all caught up"}
                  </small>
                </div>
                <div className="notification-header-actions">
                  {notifications.length > 0 && (
                    <button
                      onClick={
                        markAllAsRead
                      }
                      title="Mark all as read"
                    >
                      <i className="bi bi-check2-all"></i>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={
                        clearNotifications
                      }
                      title="Clear notifications"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  )}
                </div>
              </div>
              {/* =================================================
                  EMPTY
              ================================================= */}
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <div className="empty-bell">
                    <i className="bi bi-bell-slash"></i>
                  </div>
                  <h6>
                    No new notifications
                  </h6>
                  <p>
                    New paid orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification.id
                        }
                        className={`notification-item ${
  notification.read
      ? "read"
      : "unread"
}`}
                        onClick={() =>
                          openOrder(
                            notification
                          )
                        }
                      >
                        <div className="notification-icon">
                          <i className="bi bi-bag-check-fill"></i>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            New paid order
                            {!notification.read && (
                              <span className="unread-dot"></span>
                            )}
                          </div>
                          <div className="notification-details">
                            Order #
                            {notification.orderId}
                          </div>
                          <div className="notification-meta">
                            <span>
                              ₹
                              {notification.amount.toFixed(2)}
                            </span>
                            <span className="paid-mini">
                              {notification.paymentStatus}
                            </span>
                            <span>
                              {formatTime(
                                notification.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right notification-arrow"></i>
                      </button>
                    )
                  )}
                </div>
              )}
              {/* =================================================
                  FOOTER
              ================================================= */}
              <div className="notification-footer">
                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate("/orders");
                  }}
                >
                  View all orders
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* ===================================================
            SETTINGS
        =================================================== */}
        <div
          className="navbar-dropdown-wrapper"
          ref={settingsRef}
        >
          <button
            className="icon-btn"
            onClick={() => {
              setSettingsOpen(
                (previous) => !previous
              );
              setNotificationOpen(false);
            }}
            title="Admin settings"
          >
            <i className="bi bi-gear"></i>
          </button>
          {/* =================================================
              SETTINGS PANEL
          ================================================= */}
          {settingsOpen && (
            <div className="settings-panel">
              <div className="settings-header">
                <div className="settings-header-icon">
                  <i className="bi bi-sliders"></i>
                </div>
                <div>
                  <h6>
                    Admin Settings
                  </h6>
                  <small>
                    Manage your dashboard
                  </small>
                </div>
              </div>
              {/* =================================================
                  LIVE STATUS
              ================================================= */}
              <div className="settings-live">
                <div className="live-icon">
                  <i className="bi bi-broadcast"></i>
                </div>
                <div>
                  <strong>
                    Live Order Monitoring
                  </strong>
                  <small>
                    Checking every 3 seconds
                  </small>
                </div>
                <span className="live-badge">
                  LIVE
                </span>
              </div>
              {/* =================================================
                  SOUND
              ================================================= */}
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">
                    <i className="bi bi-volume-up"></i>
                  </div>
                  <div>
                    <strong>
                      Order Sound
                    </strong>
                    <small>
                      Play sound for new paid orders
                    </small>
                  </div>
                </div>
                <button
                  className={`toggle-switch ${
  soundEnabled
        ? "active"
        : ""
}`}
                  onClick={
                    handleSoundToggle
                  }
                  aria-label="Toggle order sound"
                >
                  <span></span>
                </button>
              </div>
              {/* =================================================
                  BROWSER NOTIFICATIONS
              ================================================= */}
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-icon">
                    <i className="bi bi-browser-chrome"></i>
                  </div>
                  <div>
                    <strong>
                      Browser Notifications
                    </strong>
                    <small>
                      Show desktop alerts
                    </small>
                  </div>
                </div>
                <button
                  className={`toggle-switch ${
  browserNotificationsEnabled
        ? "active"
        : ""
}`}
                  onClick={
                    handleBrowserNotificationToggle
                  }
                  aria-label="Toggle browser notifications"
                >
                  <span></span>
                </button>
              </div>
              {/* =================================================
                  POLLING
              ================================================= */}
              <div className="setting-row setting-row-static">
                <div className="setting-info">
                  <div className="setting-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <div>
                    <strong>
                      Auto Refresh
                    </strong>
                    <small>
                      Orders checked automatically
                    </small>
                  </div>
                </div>
                <span className="setting-value">
                  3 sec
                </span>
              </div>
              {/* =================================================
                  TEST
              ================================================= */}
              <button
                className="test-notification-btn"
                onClick={
                  testNotification
                }
              >
                <i className="bi bi-bell"></i>
                Test Notification
              </button>
            </div>
          )}
        </div>
        {/* ===================================================
            PROFILE
        =================================================== */}
        <div className="profile">
          <div className="profile-avatar">
            A
          </div>
          <div className="profile-info d-none d-md-block">
            <h6>
              Admin
            </h6>
            <small>
              Administrator
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Menubar;
