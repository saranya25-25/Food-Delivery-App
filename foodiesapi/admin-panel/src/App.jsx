import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";

import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";

const App = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };

    return (
        <div
            className="d-flex"
            id="wrapper"
            style={{
                minHeight: "100vh",
                background: "#f4f7fc",
            }}
        >
            {/* Sidebar */}

            <Sidebar sidebarVisible={sidebarVisible} />

            {/* Main Content */}

            <div
                id="page-content-wrapper"
                className="flex-grow-1"
                style={{
                    transition: "all .3s ease",
                }}
            >
                <Menubar toggleSidebar={toggleSidebar} />

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

                <div
                    className="container-fluid py-4"
                    style={{
                        animation: "fadeIn .5s ease",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<ListFood />} />
                        <Route path="/add" element={<AddFood />} />
                        <Route path="/list" element={<ListFood />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            </div>

            <style>
                {`
          @keyframes fadeIn{
            from{
              opacity:0;
              transform:translateY(15px);
            }
            to{
              opacity:1;
              transform:translateY(0);
            }
          }

          #page-content-wrapper{
            width:100%;
          }

          @media(max-width:768px){
            #page-content-wrapper{
              padding:0;
            }
          }
        `}
            </style>
        </div>
    );
};

export default App;