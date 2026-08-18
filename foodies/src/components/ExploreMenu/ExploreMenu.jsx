import React, { useState } from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";

const ITEMS_PER_PAGE = 8;

const ExploreMenu = ({ category, setCategory }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

    const startIndex = currentPage * ITEMS_PER_PAGE;

    const visibleCategories = categories.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(prev + 1, totalPages - 1)
        );
    };

    const handleCategoryClick = (itemCategory) => {
        setCategory((prev) =>
            prev === itemCategory ? "All" : itemCategory
        );
    };

    return (
        <div className="explore-menu">

            {/* ==============================
          HEADER
      ============================== */}

            <div className="explore-menu-header">

                <div>
                    <h1>Explore Our Menu</h1>

                    <p>
                        Explore curated lists of dishes from top categories
                    </p>
                </div>

                {/* ==============================
            PAGINATION ARROWS
        ============================== */}

                <div className="explore-menu-arrows">

                    <button
                        type="button"
                        className="scroll-icon"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        aria-label="Previous categories"
                    >
                        <i className="bi bi-arrow-left-circle"></i>
                    </button>

                    <button
                        type="button"
                        className="scroll-icon"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        aria-label="Next categories"
                    >
                        <i className="bi bi-arrow-right-circle"></i>
                    </button>

                </div>

            </div>


            {/* ==============================
          CATEGORY GRID
      ============================== */}

            <div className="explore-menu-list">

                {visibleCategories.map((item, index) => {

                    const isActive = item.category === category;

                    return (
                        <div
                            key={`${item.category}-${index}`}
                            className={`explore-menu-list-item ${
                                isActive ? "active" : ""
                            }`}
                            onClick={() =>
                                handleCategoryClick(item.category)
                            }
                        >

                            <img
                                src={item.icon}
                                alt={item.category}
                                className="category-image"
                            />

                            <p className={isActive ? "text-active" : ""}>
                                {item.category}
                            </p>

                        </div>
                    );

                })}

            </div>


            {/* ==============================
          PAGE INDICATOR
      ============================== */}

            {totalPages > 1 && (
                <div className="explore-page-indicator">

                    {Array.from({ length: totalPages }).map(
                        (_, index) => (
                            <span
                                key={index}
                                className={
                                    index === currentPage
                                        ? "page-dot active-dot"
                                        : "page-dot"
                                }
                                onClick={() => setCurrentPage(index)}
                            ></span>
                        )
                    )}

                </div>
            )}


            <hr />

        </div>
    );
};

export default ExploreMenu;