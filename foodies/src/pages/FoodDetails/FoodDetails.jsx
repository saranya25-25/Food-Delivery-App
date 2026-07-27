import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";
import { fetchFoodDetails } from "../../service/foodService";

import "./FoodDetails.css";


const FoodDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { increaseQty } = useContext(StoreContext);


  const [data, setData] = useState(null);



  useEffect(() => {

    const loadFoodDetails = async () => {

      try {

        const foodData = await fetchFoodDetails(id);

        setData(foodData);

      } catch(error) {

        toast.error("Error displaying the food details.");

      }

    };


    loadFoodDetails();

  }, [id]);

  const addToCart = () => {

    increaseQty(data.id);

    toast.success("Added to cart 🛒");

  };
  if(!data){

    return (

        <div className="food-loading">

          Loading delicious food... 🍽️

        </div>

    );

  }





  return (

      <main className="food-details-page">


        <div className="food-details-card">


          <div className="details-image-section">

            <img
                src={data.imageUrl}
                alt={data.name}
                className="details-food-image"
            />

          </div>




          <div className="details-content">


          <span className="food-category">

            {data.category}

          </span>



            <h1>

              {data.name}

            </h1>




            <div className="details-rating">

              ⭐ 4.5

              <span>

              (120+ reviews)

            </span>

            </div>




            <h2 className="details-price">

              ₹{data.price}

            </h2>




            <p>

              {data.description}

            </p>





            <button

                className="order-button"

                onClick={addToCart}

            >

              <i className="bi bi-cart-fill"></i>

              Add to Cart

            </button>




          </div>


        </div>


      </main>

  );

};


export default FoodDetails;