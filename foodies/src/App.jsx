import { useContext } from "react";
import Menubar from "./components/Menubar/Menubar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyOrders from "./pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify";
import { StoreContext } from "./context/StoreContext";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
const AnimatedPage = ({ children }) => {
    return (
        <motion.div
            style={{
                width:"100%"
            }}
            initial={{
                opacity:0,
                y:20
            }}
            animate={{
                opacity:1,
                y:0
            }}
            exit={{
                opacity:0,
                y:-20
            }}
            transition={{
                duration:0.35,
                ease:"easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};
const App = () => {
    const { token } = useContext(StoreContext);
    const location = useLocation();
    return (
        <div className="app-container">
            {
                !["/login","/register"].includes(location.pathname)
                &&
                <Menubar />
            }
            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />


            {/* Animated Routes */}
            <AnimatePresence mode="wait">

                <Routes location={location} key={location.pathname}>


                    <Route
                        path="/"
                        element={
                            <AnimatedPage>
                                <Home />
                            </AnimatedPage>
                        }
                    />


                    <Route
                        path="/contact"
                        element={
                            <AnimatedPage>
                                <Contact />
                            </AnimatedPage>
                        }
                    />


                    <Route
                        path="/explore"
                        element={
                            <AnimatedPage>
                                <ExploreFood />
                            </AnimatedPage>
                        }
                    />


                    <Route
                        path="/food/:id"
                        element={
                            <AnimatedPage>
                                <FoodDetails />
                            </AnimatedPage>
                        }
                    />


                    <Route
                        path="/cart"
                        element={
                            <AnimatedPage>
                                <Cart />
                            </AnimatedPage>
                        }
                    />


                    <Route
                        path="/order"
                        element={
                            token
                                ?
                                <AnimatedPage>
                                    <PlaceOrder />
                                </AnimatedPage>
                                :
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            token
                                ?
                                <AnimatedPage>
                                    <Home />
                                </AnimatedPage>
                                :
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            token
                                ?
                                <AnimatedPage>
                                    <Home />
                                </AnimatedPage>
                                :
                                <AnimatedPage>
                                    <Register />
                                </AnimatedPage>
                        }
                    />


                    <Route
                        path="/myorders"
                        element={
                            token
                                ?
                                <AnimatedPage>
                                    <MyOrders />
                                </AnimatedPage>
                                :
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                        }
                    />


                </Routes>

            </AnimatePresence>


        </div>
    );
};


export default App;