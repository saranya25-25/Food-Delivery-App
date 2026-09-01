
import {
    useState,
    useRef,
    useEffect,
    useContext
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    StoreContext
} from "../../context/StoreContext";
import "./FoodieBotDrawer.css";
const API_URL =
    "https://food-delivery-project-2y1g.onrender.com/api/agent/step";
const CART_URL =
    "https://food-delivery-project-2y1g.onrender.com/api/cart";
const FoodieBotDrawer = () => {
    const navigate = useNavigate();
    // =========================================================
    // STORE CONTEXT
    // =========================================================
    const {
        setQuantities,
        refreshCart
    } = useContext(StoreContext);
    // =========================================================
    // STATE
    // =========================================================
    const [isOpen, setIsOpen] =
        useState(false);
    const [loading, setLoading] =
        useState(false);
    const [currentAction, setCurrentAction] =
        useState("SELECT_OPTION");
    const [currentCategory, setCurrentCategory] =
        useState(null);
    const [selectedFoodName, setSelectedFoodName] =
        useState(null);
    // =========================================================
    // REFS
    // =========================================================
    const selectedFoodIdRef =
        useRef(null);
    const selectedFoodNameRef =
        useRef(null);
    const checkoutInProgressRef =
        useRef(false);
    const messagesEndRef =
        useRef(null);
    // =========================================================
    // INITIAL MESSAGE
    // =========================================================
    const [messages, setMessages] =
        useState([
            {
                sender: "bot",
                text:
                    "🍗 Hi! I am ChefBot. How can I assist you?",
                options: [
                    "Order Food",
                    "Item Preparation"
                ]
            }
        ]);
    // =========================================================
    // SCROLL TO BOTTOM
    // =========================================================
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);
    // =========================================================
    // GET TOKEN
    // =========================================================
    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("accessToken") ||
            ""
        );
    };
    // =========================================================
    // AUTH HEADERS
    // =========================================================
    const getAuthHeaders = () => {
        const token =
            getToken();
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }
        return headers;
    };
    // =========================================================
    // CHECK LOGIN
    // =========================================================
    const isUserLoggedIn = () => {
        const token =
            getToken();
        return !!token;
    };
    // =========================================================
    // ADD FOOD TO CART
    // =========================================================
    const addFoodToCart = async (foodId) => {
        if (!foodId) {
            throw new Error(
                "Food ID is missing"
            );
        }
        const token =
            getToken();
        if (!token) {
            throw new Error(
                "Please login before adding food to cart"
            );
        }
        const normalizedFoodId =
            String(foodId).trim();
        console.log(
            "================================="
        );
        console.log(
            "ADDING FOOD TO CART"
        );
        console.log(
            "Food ID:",
            normalizedFoodId
        );
        console.log(
            "================================="
        );
        const response =
            await fetch(
                CART_URL,
                {
                    method: "POST",
                    headers:
                        getAuthHeaders(),
                    body:
                        JSON.stringify({
                            foodId:
                                normalizedFoodId
                        })
                }
            );
        const responseText =
            await response.text();
        console.log(
            "POST /api/cart status:",
            response.status
        );
        console.log(
            "POST /api/cart response:",
            responseText
        );
        if (!response.ok) {
            throw new Error(
                `Cart API failed with status ${response.status}`
            );
        }
        let cartData = null;
        if (responseText) {
            try {
                cartData =
                    JSON.parse(
                        responseText
                    );
            } catch (error) {
                console.error(
                    "Cart JSON parsing error:",
                    error
                );
            }
        }
        return cartData;
    };
    // =========================================================
    // GET CURRENT CART
    // =========================================================
    const getCurrentCart = async () => {
        const token =
            getToken();
        if (!token) {
            throw new Error(
                "User is not authenticated"
            );
        }
        const response =
            await fetch(
                CART_URL,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );
        if (!response.ok) {
            const errorText =
                await response.text();
            console.error(
                "GET cart error:",
                errorText
            );
            throw new Error(
                `Unable to load cart (${response.status})`
            );
        }
        const cart =
            await response.json();
        console.log(
            "================================="
        );
        console.log(
            "CURRENT CART FROM BACKEND"
        );
        console.log(
            cart
        );
        console.log(
            "================================="
        );
        return cart;
    };
    // =========================================================
    // NORMALIZE CART
    // =========================================================
    const normalizeCart = (items) => {
        const normalizedCart = {};
        Object.entries(
            items || {}
        ).forEach(
            ([id, quantity]) => {
                const normalizedId =
                    String(id).trim();
                const normalizedQuantity =
                    Number(quantity) || 0;
                if (
                    normalizedId &&
                    normalizedQuantity > 0
                ) {
                    normalizedCart[
                        normalizedId
                    ] =
                        normalizedQuantity;
                }
            }
        );
        return normalizedCart;
    };
    // =========================================================
    // SEND CHEFBOT REQUEST
    // =========================================================
    const sendPayload = async (payload) => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            console.log(
                "================================="
            );
            console.log(
                "CHEFBOT REQUEST"
            );
            console.log(
                payload
            );
            console.log(
                "================================="
            );
            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",
                        headers:
                            getAuthHeaders(),
                        body:
                            JSON.stringify(payload)
                    }
                );
            if (!response.ok) {
                const errorText =
                    await response.text();
                console.error(
                    "ChefBot server error:",
                    errorText
                );
                throw new Error(
                    `ChefBot server returned ${response.status}`
                );
            }
            const data =
                await response.json();
            console.log(
                "================================="
            );
            console.log(
                "CHEFBOT RESPONSE"
            );
            console.log(
                data
            );
            console.log(
                "================================="
            );
            // =================================================
            // FOOD SELECTED
            // =================================================
            if (
                data.nextAction ===
                "ADD_TO_CART"
            ) {
                // IMPORTANT:
                //
                // Prefer foodId.
                //
                // Fall back to subCategory because
                // your current backend may still return
                // the ID through subCategory.
                //
                const foodId =
                    data.foodId ||
                    data.subCategory;
                if (!foodId) {
                    throw new Error(
                        "ChefBot did not return food ID"
                    );
                }
                const normalizedFoodId =
                    String(
                        foodId
                    ).trim();
                // =================================================
                // GET FOOD NAME
                // =================================================
                let foodName =
                    data.foodName ||
                    "Selected Food";
                // =================================================
                // FALLBACK: EXTRACT NAME FROM REPLY
                // =================================================
                if (
                    !data.foodName &&
                    data.reply
                ) {
                    const match =
                        data.reply.match(
                            /🛒\s*(.*?)\s*selected/
                        );
                    if (
                        match &&
                        match[1]
                    ) {
                        foodName =
                            match[1].trim();
                    }
                }
                // =================================================
                // DEBUG
                // =================================================
                console.log(
                    "================================="
                );
                console.log(
                    "CHEFBOT SELECTED FOOD"
                );
                console.log(
                    "Food ID:",
                    normalizedFoodId
                );
                console.log(
                    "Food Name:",
                    foodName
                );
                console.log(
                    "================================="
                );
                // =================================================
                // SAVE SELECTED FOOD
                // =================================================
                selectedFoodIdRef.current =
                    normalizedFoodId;
                selectedFoodNameRef.current =
                    foodName;
                setSelectedFoodName(
                    foodName
                );
                // =================================================
                // SHOW CHECKOUT OPTIONS
                // =================================================
                setMessages(
                    previous => [
                        ...previous,
                        {
                            sender: "bot",
                            text:
                                data.reply ||
                                `🛒 ${foodName} selected.`
                        },
                        {
                            sender: "bot",
                            text:
                                "What would you like to do?",
                            options: [
                                "Continue to Checkout",
                                "⬅ Back to Main Menu"
                            ]
                        }
                    ]
                );
                setCurrentAction(
                    "ADD_TO_CART"
                );
                return;
            }
            // =================================================
            // NORMAL RESPONSE
            // =================================================
            setMessages(
                previous => [
                    ...previous,
                    {
                        sender: "bot",
                        text:
                            data.reply ||
                            "Please select an option.",
                        options:
                            data.options || [],
                        recipeSteps:
                            data.recipeSteps || []
                    }
                ]
            );
            setCurrentAction(
                data.nextAction ||
                "SELECT_OPTION"
            );
            if (data.category) {
                setCurrentCategory(
                    data.category
                );
            }
        } catch (error) {
            console.error(
                "ChefBot error:",
                error
            );
            setMessages(
                previous => [
                    ...previous,
                    {
                        sender: "bot",
                        text:
                            "❌ ChefBot is temporarily unavailable. Please try again."
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    };
    // =========================================================
    // ORDER FOOD
    // =========================================================
    const handleOrderFood = () => {
        // -----------------------------------------------------
        // CHECK LOGIN
        // -----------------------------------------------------
        if (!isUserLoggedIn()) {
            setMessages(
                previous => [
                    ...previous,
                    {
                        sender: "user",
                        text:
                            "Order Food"
                    },
                    {
                        sender: "bot",
                        text:
                            "🔐 Please log in and try again."
                    }
                ]
            );
            return;
        }
        // -----------------------------------------------------
        // SHOW USER SELECTION
        // -----------------------------------------------------
        setMessages(
            previous => [
                ...previous,
                {
                    sender: "user",
                    text:
                        "Order Food"
                },
                {
                    sender: "bot",
                    text:
                        "🍽️ Great! What would you like to order?"
                }
            ]
        );
        setCurrentAction(
            "SELECT_CATEGORY"
        );
        setCurrentCategory(
            null
        );
        sendPayload({
            action:
                "SELECT_OPTION",
            selectedValue:
                "Order Food"
        });
    };
    // =========================================================
    // CONTINUE TO CHECKOUT
    // =========================================================
    const handleContinueToCheckout =
        async () => {
            // -------------------------------------------------
            // PREVENT DOUBLE CLICK
            // -------------------------------------------------
            if (
                checkoutInProgressRef.current
            ) {
                console.log(
                    "Checkout already in progress..."
                );
                return;
            }
            // -------------------------------------------------
            // GET SELECTED FOOD ID
            // -------------------------------------------------
            const foodId =
                selectedFoodIdRef.current;
            const foodName =
                selectedFoodNameRef.current ||
                selectedFoodName ||
                "Item";
            // -------------------------------------------------
            // VALIDATE FOOD ID
            // -------------------------------------------------
            if (!foodId) {
                setMessages(
                    previous => [
                        ...previous,
                        {
                            sender: "bot",
                            text:
                                "❌ Food item could not be identified. Please select the item again."
                        }
                    ]
                );
                return;
            }
            // -------------------------------------------------
            // START CHECKOUT
            // -------------------------------------------------
            checkoutInProgressRef.current =
                true;
            setLoading(true);
            try {
                // =================================================
                // 1. ADD FOOD TO BACKEND CART
                // =================================================
                console.log(
                    "================================="
                );
                console.log(
                    "STEP 1: ADD FOOD TO CART"
                );
                console.log(
                    "Food ID:",
                    foodId
                );
                console.log(
                    "================================="
                );
                await addFoodToCart(
                    foodId
                );
                console.log(
                    "Food successfully added to backend."
                );
                // =================================================
                // 2. GET FRESH CART
                // =================================================
                console.log(
                    "================================="
                );
                console.log(
                    "STEP 2: GET FRESH CART"
                );
                console.log(
                    "================================="
                );
                const verifiedCart =
                    await getCurrentCart();
                const backendItems =
                    verifiedCart?.items ||
                    {};
                console.log(
                    "Backend cart items:",
                    backendItems
                );
                // =================================================
                // 3. NORMALIZE CART
                // =================================================
                const normalizedCart =
                    normalizeCart(
                        backendItems
                    );
                console.log(
                    "Normalized cart:",
                    normalizedCart
                );
                // =================================================
                // 4. VERIFY SELECTED FOOD
                // =================================================
                const normalizedFoodId =
                    String(
                        foodId
                    ).trim();
                const selectedQuantity =
                    Number(
                        normalizedCart[
                            normalizedFoodId
                        ]
                    ) || 0;
                console.log(
                    "Selected food ID:",
                    normalizedFoodId
                );
                console.log(
                    "Selected quantity:",
                    selectedQuantity
                );
                // =================================================
                // 5. VERIFY BACKEND CART
                // =================================================
                if (
                    selectedQuantity <= 0
                ) {
                    throw new Error(
                        `Food ID ${normalizedFoodId} was not found in backend cart`
                    );
                }
                // =================================================
                // 6. UPDATE GLOBAL CART STATE
                // =================================================
                console.log(
                    "================================="
                );
                console.log(
                    "STEP 3: UPDATE GLOBAL CART"
                );
                console.log(
                    "================================="
                );
                setQuantities(
                    normalizedCart
                );
                // =================================================
                // 7. ALSO REFRESH CONTEXT IF AVAILABLE
                // =================================================
                if (
                    typeof refreshCart ===
                    "function"
                ) {
                    try {
                        const refreshedCart =
                            await refreshCart();
                        console.log(
                            "Context cart refreshed:",
                            refreshedCart
                        );
                    } catch (refreshError) {
                        console.warn(
                            "Context refresh failed, using verified cart:",
                            refreshError
                        );
                        // We already have a verified backend
                        // cart, so keep the state we received.
                        setQuantities(
                            normalizedCart
                        );
                    }
                }
                // =================================================
                // 8. CLOSE CHEFBOT
                // =================================================
                setIsOpen(false);
                // =================================================
                // 9. NAVIGATE TO CART
                // =================================================
                navigate(
                    "/cart"
                );
            } catch (error) {
                console.error(
                    "================================="
                );
                console.error(
                    "CHEFBOT CHECKOUT ERROR"
                );
                console.error(
                    error
                );
                console.error(
                    "================================="
                );
                setMessages(
                    previous => [
                        ...previous,
                        {
                            sender: "bot",
                            text:
                                `❌ Could not add ${foodName} to your cart. Please try again.`
                        }
                    ]
                );
            } finally {
                setLoading(false);
                checkoutInProgressRef.current =
                    false;
            }
        };
    // =========================================================
    // MAIN MENU
    // =========================================================
    const goToMainMenu = () => {
        setCurrentAction(
            "SELECT_OPTION"
        );
        setCurrentCategory(
            null
        );
        selectedFoodIdRef.current =
            null;
        selectedFoodNameRef.current =
            null;
        setSelectedFoodName(
            null
        );
        checkoutInProgressRef.current =
            false;
        setMessages(
            previous => [
                ...previous,
                {
                    sender: "bot",
                    text:
                        "🍗 How can I help you?",
                    options: [
                        "Order Food",
                        "Item Preparation"
                    ]
                }
            ]
        );
    };
    // =========================================================
    // CATEGORIES
    // =========================================================
    const goToCategories = () => {
        setCurrentAction(
            "SELECT_CATEGORY"
        );
        setCurrentCategory(
            null
        );
        selectedFoodIdRef.current =
            null;
        selectedFoodNameRef.current =
            null;
        setSelectedFoodName(
            null
        );
        checkoutInProgressRef.current =
            false;
        setMessages(
            previous => [
                ...previous,
                {
                    sender: "bot",
                    text:
                        "🍽️ Select a food category:",
                    options: []
                }
            ]
        );
        sendPayload({
            action:
                "SELECT_OPTION",
            selectedValue:
                "Order Food"
        });
    };
    // =========================================================
    // OPTION CLICK
    // =========================================================
    const handleOptionClick = (
        optionText
    ) => {
        // -----------------------------------------------------
        // DON'T ALLOW ACTION WHILE LOADING
        // -----------------------------------------------------
        if (loading) {
            return;
        }
        // =====================================================
        // ORDER FOOD
        // =====================================================
        if (
            optionText ===
            "Order Food"
        ) {
            handleOrderFood();
            return;
        }
        // =====================================================
        // CHECKOUT
        // =====================================================
        if (
            optionText ===
            "Continue to Checkout"
        ) {
            handleContinueToCheckout();
            return;
        }
        // =====================================================
        // BACK MAIN MENU
        // =====================================================
        if (
            optionText.includes(
                "Back to Main Menu"
            )
        ) {
            goToMainMenu();
            return;
        }
        // =====================================================
        // BACK CATEGORIES
        // =====================================================
        if (
            optionText.includes(
                "Back to Categories"
            )
        ) {
            goToCategories();
            return;
        }
        // =====================================================
        // USER SELECTION
        // =====================================================
        setMessages(
            previous => [
                ...previous,
                {
                    sender: "user",
                    text:
                        optionText
                }
            ]
        );
        // =====================================================
        // SEND TO BACKEND
        // =====================================================
        sendPayload({
            action:
                currentAction,
            selectedValue:
                optionText,
            category:
                currentCategory
        });
    };
    // =========================================================
    // OPEN CHEFBOT
    // =========================================================
    const openChefBot = () => {
        setIsOpen(true);
    };
    // =========================================================
    // CLOSE CHEFBOT
    // =========================================================
    const closeChefBot = () => {
        setIsOpen(false);
    };
    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="foodie-bot-wrapper">
            {/* =================================================
                FLOATING CHEFBOT BUTTON
            ================================================= */}
            {!isOpen && (
                <button
                    className="chefbot-floating-btn"
                    onClick={openChefBot}
                    aria-label="Open ChefBot"
                >
                    <span className="chefbot-food-orbit">
                        🍕
                    </span>
                    <span className="chefbot-main-icon">
                        👨‍🍳
                    </span>
                    <span className="chefbot-btn-content">
                        <span className="chefbot-small-text">
                            Hungry?
                        </span>
                        <span className="chefbot-title">
                            Talk to ChefBot
                        </span>
                        <span className="chefbot-subtitle">
                            Find • Order • Cook
                        </span>
                    </span>
                    <span className="chefbot-arrow">
                        →
                    </span>
                </button>
            )}
            {/* =================================================
                CHAT WINDOW
            ================================================= */}
            {isOpen && (
                <div className="chefbot-modal">
                    {/* =================================================
                        HEADER
                    ================================================= */}
                    <div className="chefbot-header">
                        <div className="chefbot-header-info">
                            <div className="chefbot-avatar">
                                👨‍🍳
                            </div>
                            <div>
                                <h3>
                                    ChefBot AI
                                </h3>
                                <span>
                                    🟢 Online • Ready to help
                                </span>
                            </div>
                        </div>
                        <button
                            className="close-btn"
                            onClick={closeChefBot}
                        >
                            ✕
                        </button>
                    </div>
                    {/* =================================================
                        MESSAGES
                    ================================================= */}
                    <div className="chefbot-messages">
                        {messages.map(
                            (
                                msg,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="message-block"
                                >
                                    {/* =================================================
                                        MESSAGE
                                    ================================================= */}
                                    <div
                                        className={
                                            `chat-bubble ${
    msg.sender === "user"
        ? "user-bubble"
        : "bot-bubble"
}`
                                        }
                                    >
                                        {msg.text}
                                    </div>
                                    {/* =================================================
                                        RECIPE
                                    ================================================= */}
                                    {msg.recipeSteps &&
                                        msg.recipeSteps.length > 0 && (
                                            <div className="recipe-container chat-bubble bot-bubble">
                                                {msg.recipeSteps.map(
                                                    (
                                                        step,
                                                        idx
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                        >
                                                            {step}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    {/* =================================================
                                        OPTIONS
                                    ================================================= */}
                                    {msg.options &&
                                        msg.options.length > 0 && (
                                            <div className="options-container">
                                                {msg.options.map(
                                                    (
                                                        option,
                                                        idx
                                                    ) => {
                                                        const isBack =
                                                            option.includes(
                                                                "Back"
                                                            ) ||
                                                            option.includes(
                                                                "⬅"
                                                            );
                                                        return (
                                                            <button
                                                                key={idx}
                                                                className={
                                                                    isBack
                                                                        ? "back-option-btn"
                                                                        : "option-btn"
                                                                }
                                                                onClick={() =>
                                                                    handleOptionClick(
                                                                        option
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                {option}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                </div>
                            )
                        )}
                        {/* =================================================
                            LOADING
                        ================================================= */}
                        {loading && (
                            <div className="chat-bubble bot-bubble loading-bubble">
                                <span className="loading-food">
                                    🍳
                                </span>
                                <span>
                                    ⏳ Please wait for a few seconds...
                                </span>
                                <span className="loading-dots">
                                    •••
                                </span>
                            </div>
                        )}
                        <div
                            ref={messagesEndRef}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default FoodieBotDrawer;
