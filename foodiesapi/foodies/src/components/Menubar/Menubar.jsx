import { useContext, useEffect, useState } from "react";
import "./Menubar.css";

import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { StoreContext } from "../../context/StoreContext";


const Menubar = () => {


  const {
    quantities,
    token,
    setToken,
    setQuantities

  } = useContext(StoreContext);



  const navigate = useNavigate();

  const location = useLocation();



  const [cartAnimation,setCartAnimation] = useState(false);



  const cartCount = Object.values(quantities)
      .filter((qty)=>qty>0)
      .length;




  useEffect(()=>{


    if(cartCount===0) return;


    setCartAnimation(true);


    const timer=setTimeout(()=>{

      setCartAnimation(false);

    },400);



    return ()=>clearTimeout(timer);



  },[cartCount]);





  const logout = ()=>{


    localStorage.removeItem("token");

    setToken("");

    setQuantities({});


    navigate("/");


  };






  const isActive=(path)=>{

    return location.pathname===path;

  };






  return (

      <nav className="food-navbar">


        <div className="container-fluid px-4">


          <div className="navbar-wrapper">


            {/* LOGO */}

            <Link
                to="/"
                className="navbar-brand"
            >


              <img
                  src={assets.logo}
                  alt="Foodies"
                  className="nav-logo"
              />


              <span className="brand-name">
                            Foodies
                        </span>


            </Link>







            {/* MENU */}


            <div className="nav-links">


              <Link
                  to="/"
                  className={
                    isActive("/")
                        ?
                        "food-nav-link active-link"
                        :
                        "food-nav-link"
                  }
              >
                Home
              </Link>



              <Link
                  to="/explore"
                  className={
                    isActive("/explore")
                        ?
                        "food-nav-link active-link"
                        :
                        "food-nav-link"
                  }
              >
                Explore
              </Link>




              <Link
                  to="/contact"
                  className={
                    isActive("/contact")
                        ?
                        "food-nav-link active-link"
                        :
                        "food-nav-link"
                  }
              >
                Contact
              </Link>



            </div>








            {/* RIGHT SIDE */}


            <div className="nav-actions">





              {/* CART */}


              <Link
                  to="/cart"
                  className={
                    cartAnimation
                        ?
                        "cart-wrapper cart-animation"
                        :
                        "cart-wrapper"
                  }
              >


                <img
                    src={assets.cart}
                    alt="cart"
                />


                {
                    cartCount>0 &&

                    <span className="cart-count">
                                    {cartCount}
                                </span>

                }



              </Link>







              {

                !token ?

                    <>


                      <button

                          className="login-btn"

                          onClick={()=>navigate("/login")}

                      >

                        Login

                      </button>





                      <button

                          className="register-btn"

                          onClick={()=>navigate("/register")}

                      >

                        Register

                      </button>



                    </>


                    :


                    <div className="dropdown">


                      <button

                          className="profile-btn dropdown-toggle"

                          data-bs-toggle="dropdown"

                      >


                        <img

                            src={assets.profile}

                            alt="profile"

                        />


                      </button>





                      <ul className="dropdown-menu profile-menu">


                        <li

                            onClick={()=>navigate("/myorders")}

                        >

                          🛍️ My Orders

                        </li>



                        <li

                            onClick={logout}

                        >

                          🚪 Logout

                        </li>



                      </ul>


                    </div>


              }



            </div>



          </div>


        </div>



      </nav>

  );

};


export default Menubar;