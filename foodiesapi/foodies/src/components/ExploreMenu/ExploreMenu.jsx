
import React, {
    useRef,
    useState
} from "react";
import {
    categories
} from "../../assets/assets";
import "./ExploreMenu.css";
const ITEMS_PER_PAGE = 8;
const ExploreMenu = ({
                         category,
                         setCategory
                     }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    // =========================================================
    // PAGINATION
    // =========================================================
    const totalPages = Math.ceil(
        categories.length / ITEMS_PER_PAGE
    );
    const startIndex =
        currentPage * ITEMS_PER_PAGE;
    const visibleCategories =
        categories.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    // =========================================================
    // PREVIOUS PAGE
    // =========================================================
    const goToPreviousPage = () => {
        setCurrentPage((previous) =>
            Math.max(previous - 1, 0)
        );
    };
    // =========================================================
    // NEXT PAGE
    // =========================================================
    const goToNextPage = () => {
        setCurrentPage((previous) =>
            Math.min(
                previous + 1,
                totalPages - 1
            )
        );
    };
    // =========================================================
    // CATEGORY CLICK
    // =========================================================
    const handleCategoryClick = (itemCategory) => {
        const newCategory =
            category === itemCategory
                ? "All"
                : itemCategory;
        // First change the category
        setCategory(newCategory);
        /*
         * Wait until React updates the food list.
         *
         * Two requestAnimationFrame calls are used so that
         * the updated food items have been rendered before
         * calculating the food section position.
         */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const foodSection =
                    document.getElementById(
                        "food-display-section"
                    );
                if (!foodSection) {
                    return;
                }
                /*
                 * Get the CURRENT position of the food section
                 * after the category has been changed.
                 */
                const sectionTop =
                    foodSection.getBoundingClientRect().top +
                    window.scrollY;
                /*
                 * Move the page so the food section appears
                 * directly on the screen.
                 *
                 * 20px gives a small amount of space at the top.
                 */
                window.scrollTo({
                    top: Math.max(
                        sectionTop - 20,
                        0
                    ),
                    behavior: "smooth"
                });
            });
        });
    };
    // =========================================================
    // MOUSE DOWN
    // =========================================================
    const handleMouseDown = (event) => {
        if (!sliderRef.current) {
            return;
        }
        isDragging.current = true;
        startX.current =
            event.pageX -
            sliderRef.current.offsetLeft;
        startScrollLeft.current =
            sliderRef.current.scrollLeft;
        sliderRef.current.classList.add(
            "is-dragging"
        );
    };
    // =========================================================
    // MOUSE LEAVE
    // =========================================================
    const handleMouseLeave = () => {
        if (!isDragging.current) {
            return;
        }
        isDragging.current = false;
        if (sliderRef.current) {
            sliderRef.current.classList.remove(
                "is-dragging"
            );
        }
    };
    // =========================================================
    // MOUSE UP
    // =========================================================
    const handleMouseUp = () => {
        isDragging.current = false;
        if (sliderRef.current) {
            sliderRef.current.classList.remove(
                "is-dragging"
            );
        }
    };
    // =========================================================
    // MOUSE MOVE
    // =========================================================
    const handleMouseMove = (event) => {
        if (!isDragging.current) {
            return;
        }
        if (!sliderRef.current) {
            return;
        }
        event.preventDefault();
        const x =
            event.pageX -
            sliderRef.current.offsetLeft;
        const walk =
            (x - startX.current) * 1.2;
        sliderRef.current.scrollLeft =
            startScrollLeft.current - walk;
    };
    // =========================================================
    // TOUCH START
    // =========================================================
    const handleTouchStart = (event) => {
        if (!sliderRef.current) {
            return;
        }
        startX.current =
            event.touches[0].pageX;
        startScrollLeft.current =
            sliderRef.current.scrollLeft;
    };
    // =========================================================
    // TOUCH MOVE
    // =========================================================
    const handleTouchMove = (event) => {
        if (!sliderRef.current) {
            return;
        }
        const currentX =
            event.touches[0].pageX;
        const distance =
            currentX - startX.current;
        sliderRef.current.scrollLeft =
            startScrollLeft.current - distance;
    };
    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="explore-menu">
            {/* =====================================================
                HEADER
            ===================================================== */}
            <div className="explore-menu-header">
                <div className="explore-menu-title">
                    <h1>
                        Explore Our Menu
                    </h1>
                    <p>
                        Explore curated lists of dishes from top categories
                    </p>
                </div>
                {/* =================================================
                    ARROWS
                ================================================= */}
                <div className="explore-menu-arrows">
                    <button
                        type="button"
                        className="scroll-icon"
                        onClick={goToPreviousPage}
                        disabled={
                            currentPage === 0
                        }
                        aria-label="Previous categories"
                    >
                        <i className="bi bi-arrow-left-circle"></i>
                    </button>
                    <button
                        type="button"
                        className="scroll-icon"
                        onClick={goToNextPage}
                        disabled={
                            currentPage === totalPages - 1
                        }
                        aria-label="Next categories"
                    >
                        <i className="bi bi-arrow-right-circle"></i>
                    </button>
                </div>
            </div>
            {/* =====================================================
                CATEGORY GRID
            ===================================================== */}
            <div
                ref={sliderRef}
                className="explore-menu-list"
                onMouseDown={
                    handleMouseDown
                }
                onMouseLeave={
                    handleMouseLeave
                }
                onMouseUp={
                    handleMouseUp
                }
                onMouseMove={
                    handleMouseMove
                }
                onTouchStart={
                    handleTouchStart
                }
                onTouchMove={
                    handleTouchMove
                }
            >
                {visibleCategories.map(
                    (item, index) => {
                        const isActive =
                            item.category === category;
                        return (
                            <div
                                key={`${item.category}-${index}`}
                                className={
                                    `explore-menu-list-item ${
    isActive
        ? "active"
        : ""
}`
                                }
                                onClick={() =>
                                    handleCategoryClick(
                                        item.category
                                    )
                                }
                            >
                                {/* IMAGE */}
                                <div className="category-image-wrapper">
                                    <img
                                        src={item.icon}
                                        alt={item.category}
                                        className="category-image"
                                        draggable="false"
                                    />
                                </div>
                                {/* TEXT */}
                                <p
                                    className={
                                        isActive
                                            ? "text-active"
                                            : ""
                                    }
                                >
                                    {item.category}
                                </p>
                            </div>
                        );
                    }
                )}
            </div>
            {/* =====================================================
                SWIPE HINT
            ===================================================== */}
            <div className="explore-swipe-hint">
                <i className="bi bi-hand-index-thumb"></i>
                <span>
                    Drag or swipe to explore
                </span>
            </div>
            {/* =====================================================
                PAGE INDICATOR
            ===================================================== */}
            {totalPages > 1 && (
                <div className="explore-page-indicator">
                    {Array.from({
                        length: totalPages
                    }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={
                                index === currentPage
                                    ? "page-dot active-dot"
                                    : "page-dot"
                            }
                            onClick={() =>
                                setCurrentPage(index)
                            }
                            aria-label={
                                `Go to category page ${
    index + 1
}`
                            }
                        />
                    ))}
                </div>
            )}
            {/* =====================================================
                DIVIDER
            ===================================================== */}
            <hr />
        </div>
    );
};
export default ExploreMenu;
