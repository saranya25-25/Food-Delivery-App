
import { useState } from "react";
import {
    Route,
    Routes
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";
// =========================================================
// ADMIN LAYOUT
// =========================================================
const AdminLayout = () => {
    const [
        sidebarVisible,
        setSidebarVisible
    ] = useState(true);
    // =======================================================
    // TOGGLE SIDEBAR
    // =======================================================
    const toggleSidebar = () => {
        setSidebarVisible(
            (previous) => !previous
        );
    };
    return (
        <div
            className="d-flex"
            id="wrapper"
            style={{
                minHeight: "100vh",
                background: "#f4f7fc"
            }}
        >
            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}
            <Sidebar
                sidebarVisible={
                    sidebarVisible
                }
            />
            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}
            <div
                id="page-content-wrapper"
                className="flex-grow-1"
                style={{
                    transition:
                        "all .3s ease",
                    width: "100%"
                }}
            >
                {/* ================================================= */}
                {/* MENU BAR */}
                {/* ================================================= */}
                <Menubar
                    toggleSidebar={
                        toggleSidebar
                    }
                />
                {/* ================================================= */}
                {/* TOAST */}
                {/* ================================================= */}
                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
                {/* ================================================= */}
                {/* ADMIN PAGES */}
                {/* ================================================= */}
                <div
                    className="container-fluid py-4"
                    style={{
                        animation:
                            "fadeIn .5s ease"
                    }}
                >
                    <Routes>
                        {/* ========================================= */}
                        {/* DEFAULT PAGE */}
                        {/* ========================================= */}
                        <Route
                            path="/"
                            element={
                                <ListFood />
                            }
                        />
                        {/* ========================================= */}
                        {/* ADD FOOD */}
                        {/* ========================================= */}
                        <Route
                            path="/add"
                            element={
                                <AddFood />
                            }
                        />
                        {/* ========================================= */}
                        {/* FOOD LIST */}
                        {/* ========================================= */}
                        <Route
                            path="/list"
                            element={
                                <ListFood />
                            }
                        />
                        {/* ========================================= */}
                        {/* ORDERS */}
                        {/* ========================================= */}
                        <Route
                            path="/orders"
                            element={
                                <Orders />
                            }
                        />
                    </Routes>
                </div>
            </div>
            {/* ================================================= */}
            {/* ANIMATION */}
            {/* ================================================= */}
            <style>
                {`
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
#page-content-wrapper {
    width: 100%;
}
@media(max-width:768px) {
    #page-content-wrapper {
        padding: 0;
    }
}
`}
            </style>
        </div>
    );
};
// =========================================================
// MAIN APP
// =========================================================
const App = () => {
    return (
        <Routes>
            {/* ================================================= */}
            {/* ADMIN PANEL */}
            {/* ================================================= */}
            //
            // NO LOGIN
            // NO TOKEN
            // NO PROTECTED ROUTE
            //
            // Open application directly.
            //
            // =================================================
            <Route
                path="/*"
                element={
                    <AdminLayout />
                }
            />
        </Routes>
    );
};
export default App;
