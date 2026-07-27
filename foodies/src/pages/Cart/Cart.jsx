import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";

import "./Cart.css";


const Cart = () => {


    const navigate = useNavigate();


    const {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart

    } = useContext(StoreContext);



    const [removingIds,setRemovingIds] = useState({});





    const cartItems = foodList.filter(
        food => quantities[food.id] > 0
    );





    const {
        subtotal,
        shipping,
        tax,
        total

    } = calculateCartTotals(
        cartItems,
        quantities
    );






    const handleRemove=(id)=>{


        setRemovingIds(prev=>({

            ...prev,

            [id]:true

        }));


        setTimeout(()=>{


            removeFromCart(id);



            setRemovingIds(prev=>{

                const updated={...prev};

                delete updated[id];

                return updated;

            });


        },300);


    };









    return (


        <main className="cart-page">


            <div className="container py-5">


                <h1 className="cart-heading">

                    Your Cart 🛒

                </h1>






                <div className="row g-4">






                    <div className="col-lg-8">





                        {
                            cartItems.length===0 ?


                                <div className="empty-cart">


                                    <i className="bi bi-cart-x empty-cart-icon"></i>


                                    <h3>
                                        Your cart is empty
                                    </h3>


                                    <p>
                                        Add tasty food items and enjoy your meal.
                                    </p>



                                    <Link
                                        to="/explore"
                                        className="continue-btn"
                                    >

                                        Explore Food

                                    </Link>



                                </div>




                                :


                                <div className="cart-items-box">


                                    {

                                        cartItems.map((food,index)=>(


                                            <div

                                                key={food.id}

                                                className={
                                                    `cart-item 
${removingIds[food.id]
                                                        ?
                                                        "cart-item-leaving"
                                                        :
                                                        ""
                                                    }`

                                                }


                                                style={{

                                                    animationDelay:
                                                        `${index*0.05}s`

                                                }}

                                            >



                                                <img

                                                    src={food.imageUrl}

                                                    alt={food.name}

                                                    className="cart-item-img"

                                                />






                                                <div className="cart-item-details">


                                                    <h5>

                                                        {food.name}

                                                    </h5>


                                                    <p>

                                                        {food.category}

                                                    </p>


                                                    <span>

₹{food.price}

</span>


                                                </div>








                                                <div className="quantity-control">


                                                    <button

                                                        onClick={()=>
                                                            decreaseQty(food.id)
                                                        }

                                                    >

                                                        −

                                                    </button>



                                                    <span>

{quantities[food.id]}

</span>



                                                    <button

                                                        onClick={()=>
                                                            increaseQty(food.id)
                                                        }

                                                    >

                                                        +

                                                    </button>


                                                </div>









                                                <div className="cart-price-section">


                                                    <strong>

                                                        ₹
                                                        {
                                                            (
                                                                food.price *
                                                                quantities[food.id]

                                                            ).toFixed(2)

                                                        }

                                                    </strong>




                                                    <button

                                                        className="remove-btn"

                                                        onClick={()=>
                                                            handleRemove(food.id)
                                                        }

                                                    >

                                                        <i className="bi bi-trash"></i>


                                                    </button>



                                                </div>





                                            </div>



                                        ))


                                    }



                                </div>



                        }







                        <Link

                            to="/"

                            className="continue-shopping"

                        >

                            <i className="bi bi-arrow-left"></i>

                            Continue Shopping


                        </Link>





                    </div>









                    <div className="col-lg-4">



                        <div className="cart-summary">


                            <h3>

                                Order Summary

                            </h3>




                            <div className="summary-row">

<span>
Subtotal
</span>


                                <span>
₹{subtotal.toFixed(2)}
</span>

                            </div>





                            <div className="summary-row">


<span>
Shipping
</span>


                                <span>

₹
                                    {
                                        subtotal===0
                                            ?
                                            "0.00"
                                            :
                                            shipping.toFixed(2)

                                    }

</span>


                            </div>







                            <div className="summary-row">


<span>
Tax
</span>


                                <span>
₹{tax.toFixed(2)}
</span>


                            </div>






                            <hr/>





                            <div className="total-row">


                                <strong>
                                    Total
                                </strong>


                                <strong className="total-amount">

                                    ₹
                                    {
                                        total.toFixed(2)
                                    }

                                </strong>


                            </div>







                            <button

                                className="checkout-btn"

                                disabled={
                                    cartItems.length===0
                                }

                                onClick={()=>
                                    navigate("/order")
                                }

                            >

                                Proceed To Checkout

                                <i className="bi bi-arrow-right"></i>


                            </button>




                        </div>



                    </div>







                </div>





            </div>


        </main>


    );


};


export default Cart;