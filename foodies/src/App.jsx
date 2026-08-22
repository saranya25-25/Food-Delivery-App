import { useContext } from "react";
import {
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import {
    AnimatePresence,
    motion
} from "framer-motion";

import {
    ToastContainer
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Menubar from "./components/Menubar/Menubar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import MyOrders from "./pages/MyOrders/MyOrders";
import Profile from "./pages/Profile/Profile";
import Favorites from "./components/Favorites/Favorites";

import { StoreContext } from "./context/StoreContext";


// =========================================================
// ANIMATED PAGE
// =========================================================

const AnimatedPage = ({ children }) => {
    return (
        <motion.div
            style={{
                width: "100%"
            }}
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -20
            }}
            transition={{
                duration: 0.35,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};


// =========================================================
// APP
// =========================================================

const App = () => {

    const { token } =
        useContext(StoreContext);

    const location =
        useLocation();


    const isAuthPage =
        ["/login", "/register"]
            .includes(location.pathname);


    return (
        <div className="app-container">

            {/* =================================================
                MENUBAR
            ================================================= */}

            {!isAuthPage && <Menubar />}


            {/* =================================================
                TOAST
            ================================================= */}

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />


            {/* =================================================
                ROUTES
            ================================================= */}

            <AnimatePresence mode="wait">

                <Routes
                    location={location}
                    key={location.pathname}
                >

                    {/* =================================================
                        HOME
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <AnimatedPage>
                                <Home />
                            </AnimatedPage>
                        }
                    />


                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <Route
                        path="/contact"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Contact />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        EXPLORE
                    ================================================= */}

                    <Route
                        path="/explore"
                        element={
                            <AnimatedPage>
                                <ExploreFood />
                            </AnimatedPage>
                        }
                    />


                    {/* =================================================
                        FOOD DETAILS
                    ================================================= */}

                    <Route
                        path="/food/:id"
                        element={
                            <AnimatedPage>
                                <FoodDetails />
                            </AnimatedPage>
                        }
                    />


                    {/* =================================================
                        CART
                    ================================================= */}

                    <Route
                        path="/cart"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Cart />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Register />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        PLACE ORDER
                    ================================================= */}

                    <Route
                        path="/order"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <PlaceOrder />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        MY ORDERS
                    ================================================= */}

                    <Route
                        path="/myorders"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <MyOrders />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <Route
                        path="/profile"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Profile />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        FAVORITES
                    ================================================= */}

                    <Route
                        path="/favorites"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Favorites />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <Route
                        path="/login"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Home />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            )
                        }
                    />


                    {/* =================================================
                        REGISTER
                    ================================================= */}

                    <Route
                        path="/register"
                        element={
                            token ? (
                                <AnimatedPage>
                                    <Home />
                                </AnimatedPage>
                            ) : (
                                <AnimatedPage>
                                    <Register />
                                </AnimatedPage>
                            )
                        }
                    />

                </Routes>

            </AnimatePresence>

        </div>
    );
};


export default App;