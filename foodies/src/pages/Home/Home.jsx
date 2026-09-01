import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Home.css";
const Home = () => {
    // =========================================================
    // STATE
    // =========================================================
    const [category, setCategory] = useState("All");
    const [searchText, setSearchText] = useState("");
    // =========================================================
    // FOOD SECTION REFERENCE
    // =========================================================
    const foodSectionRef = useRef(null);
    // =========================================================
    // SCROLL TO FOOD SECTION
    // =========================================================
    const scrollToFoodSection = () => {
        if (!foodSectionRef.current) {
            return;
        }
        const element =
            foodSectionRef.current;
        /*
         * Get the exact position of the food section.
         *
         * This works whether the user is:
         *
         *     ABOVE the food section
         *
         * or
         *
         *     BELOW the food section.
         *
         * The browser automatically decides whether
         * to move UP or DOWN.
         */
        const elementPosition =
            element.getBoundingClientRect().top;
        const currentScroll =
            window.scrollY;
        const targetPosition =
            currentScroll + elementPosition - 15;
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    };
    // =========================================================
    // CATEGORY CHANGE
    // =========================================================
    const handleCategoryChange = (newCategory) => {
        /*
         * Update selected category.
         */
        setCategory(newCategory);
        /*
         * Wait until React updates FoodDisplay.
         */
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollToFoodSection();
            }, 100);
        });
    };
    // =========================================================
    // SEARCH CHANGE
    // =========================================================
    useEffect(() => {
        /*
         * Don't scroll when search box is empty.
         */
        if (!searchText.trim()) {
            return;
        }
        /*
         * Wait a little so the filtered
         * food items are rendered first.
         */
        const timer =
            setTimeout(() => {
                scrollToFoodSection();
            }, 300);
        /*
         * Clear previous timer
         * if user continues typing.
         */
        return () => {
            clearTimeout(timer);
        };
    }, [searchText]);
    // =========================================================
    // PAGE
    // =========================================================
    return (
        <main className="home-page">
            {/* =================================================
                HERO / HEADER
            ================================================= */}
            <section className="hero-section">
                <div className="container">
                    <Header
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                </div>
            </section>
            {/* =================================================
                EXPLORE MENU
            ================================================= */}
            <section className="home-section explore-section">
                <div className="container">
                    <ExploreMenu
                        category={category}
                        setCategory={handleCategoryChange}
                    />
                </div>
            </section>
            {/* =================================================
                FOOD DISPLAY
            ================================================= */}
            <section
                ref={foodSectionRef}
                className="home-section food-section"
            >
                <div className="container">
                    <FoodDisplay
                        category={category}
                        searchText={searchText}
                    />
                </div>
            </section>
        </main>
    );
};
export default Home;