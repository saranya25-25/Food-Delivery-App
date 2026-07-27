import { useContext } from "react";
import { Link } from "react-router-dom";

import { StoreContext } from "../../context/StoreContext";

import "./FoodItem.css";


const FoodItem = ({
                      name,
                      description,
                      id,
                      imageUrl,
                      price
                  }) => {


    const {
        increaseQty,
        decreaseQty,
        quantities

    } = useContext(StoreContext);



    const quantity = quantities[id] || 0;



    return (


        <article className="food-card">





            {/* IMAGE SECTION */}


            <Link
                to={`/food/${id}`}
                className="food-image-link"
            >


                <div className="food-image-wrapper">


                    <img

                        src={imageUrl}

                        alt={name}

                        className="food-image"

                        loading="lazy"

                    />



                    <div className="image-overlay">

                        View Details

                    </div>


                </div>


            </Link>








            {/* FOOD DETAILS */}


            <div className="food-content">



                <h3>

                    {name}

                </h3>




                <p className="food-description">

                    {description}

                </p>






                <div className="food-info">


                    <span className="food-price">

                        ₹{price}

                    </span>





                    <div className="rating">


                        <i className="bi bi-star-fill"></i>


                        <span>

                            4.5

                        </span>


                    </div>



                </div>



            </div>









            {/* ACTIONS */}



            <div className="food-actions">



                <Link

                    to={`/food/${id}`}

                    className="view-food-btn"

                >

                    View


                </Link>





                {

                    quantity > 0


                        ?



                        <div className="quantity-box">



                            <button

                                type="button"

                                className="minus-btn"

                                onClick={() => decreaseQty(id)}

                                aria-label="Decrease quantity"

                            >

                                <i className="bi bi-dash"></i>


                            </button>





                            <span className="quantity-number">


                            {quantity}


                        </span>







                            <button

                                type="button"

                                className="plus-btn"

                                onClick={() => increaseQty(id)}

                                aria-label="Increase quantity"

                            >

                                <i className="bi bi-plus"></i>


                            </button>



                        </div>





                        :





                        <button

                            type="button"

                            className="add-cart-btn"

                            onClick={() => increaseQty(id)}

                        >


                            <i className="bi bi-cart-plus"></i>


                            Add



                        </button>


                }




            </div>





        </article>


    );

};



export default FoodItem;