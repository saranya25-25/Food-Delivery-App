import { Link } from "react-router-dom";
import "./Header.css";
import headerImage from "../../assets/header.png";
const Header = () => {
    return (
        <section
            className="hero-header"
            style={{
                backgroundImage: `url(${headerImage})`
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-title">
                    Order your
                    <span>favorite food</span>
                    here
                </h1>
                <p className="hero-description">
                    Discover delicious meals,
                    explore amazing restaurants,
                    and get your favorite food delivered fast.
                </p>
                <Link to="/explore" className="hero-button">
                    Explore Food
                    <i className="bi bi-arrow-right"></i>
                </Link>
            </div>
        </section>
    );
};
export default Header;