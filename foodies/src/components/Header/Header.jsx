import { Link } from "react-router-dom";
import "./Header.css";

import headerImage from "../../assets/header.png";

// import tomato from "../../assets/food-animation/tomato.png";
// import onion from "../../assets/food-animation/onion.png";
// import pizza from "../../assets/food-animation/pizza.png";
// import burger from "../../assets/food-animation/burger.png";
// import cake from "../../assets/food-animation/cake.png";
// import icecream from "../../assets/food-animation/icecream.png";
import Food3D from "../Food3D/Food3D";
const Header = () => {


    return (

        <section
            className="hero-header"
            style={{
                backgroundImage:`url(${headerImage})`
            }}
        >

            <Food3D/>




            <div className="hero-overlay"></div>



            <div className="hero-content">


                <h1 className="hero-title">

                    Order your

                    <span>
                        favorite food
                    </span>

                    here

                </h1>



                <p className="hero-description">

                    Discover delicious meals,
                    explore amazing restaurants,
                    and get your favorite food delivered fast.

                </p>




                <Link
                    to="/explore"
                    className="hero-button"
                >

                    Explore Food

                    <i className="bi bi-arrow-right"></i>

                </Link>



            </div>



        </section>

    );

};


export default Header;