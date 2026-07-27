import { useContext } from "react";

import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

import "./FoodDisplay.css";



const FoodDisplay = ({ category, searchText }) => {


    const { foodList } = useContext(StoreContext);



    const foods = foodList || [];



    const filteredFoods = foods.filter((food)=>{


        const matchesCategory =
            category === "All" ||
            food.category === category;



        const matchesSearch =
            food.name
                .toLowerCase()
                .includes(
                    searchText.trim().toLowerCase()
                );



        return matchesCategory && matchesSearch;


    });






    return (


        <section className="food-display">



            <div className="food-section-header">


                <div>

                    <span className="section-tag">
                        Fresh & Delicious
                    </span>


                    <h2>
                        Popular Dishes 🍽️
                    </h2>


                    <p>
                        Explore amazing food prepared by our chefs
                    </p>


                </div>


            </div>







            {

                filteredFoods.length > 0

                    ?


                    <div className="food-grid">


                        {

                            filteredFoods.map((food,index)=>(



                                <div

                                    key={food.id}

                                    className="food-card-wrapper"

                                    style={{
                                        animationDelay:
                                            `${index * 0.08}s`
                                    }}

                                >



                                    <FoodItem

                                        id={food.id}

                                        name={food.name}

                                        description={food.description}

                                        imageUrl={food.imageUrl}

                                        price={food.price}

                                    />


                                </div>


                            ))


                        }


                    </div>



                    :



                    <div className="empty-food">


                        <div className="empty-icon">

                            🍕


                        </div>



                        <h3>

                            No delicious food found

                        </h3>



                        <p>

                            Try searching another dish or category.

                        </p>


                    </div>


            }



        </section>


    );


};


export default FoodDisplay;