import { useState } from "react";

import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

import "./ExploreFood.css";


const ExploreFood = () => {


  const [category, setCategory] = useState("All");

  const [searchText, setSearchText] = useState("");



  return (

      <main className="explore-page">


        {/* SEARCH SECTION */}

        <section className="search-section">


          <div className="search-container">


            <div className="search-header">


              <h1>
                Find Your Favorite Food 🍔
              </h1>


              <p>
                Search from hundreds of delicious dishes
              </p>


            </div>





            <form
                className="food-search"
                onSubmit={(e)=>e.preventDefault()}
            >



              <select

                  value={category}

                  onChange={(e)=>
                      setCategory(e.target.value)
                  }

              >

                <option value="All">
                  All Categories
                </option>

                <option value="Biryani">
                  Biryani
                </option>

                <option value="Burger">
                  Burger
                </option>

                <option value="Cake">
                  Cakes
                </option>

                <option value="Ice cream">
                  Ice Cream
                </option>

                <option value="Pizza">
                  Pizza
                </option>

                <option value="Rolls">
                  Rolls
                </option>

                <option value="Salad">
                  Salad
                </option>


              </select>





              <div className="search-input">


                <i className="bi bi-search"></i>


                <input

                    type="text"

                    placeholder="Search your favorite dish..."

                    value={searchText}

                    onChange={(e)=>
                        setSearchText(e.target.value)
                    }

                />


              </div>




              <button
                  type="submit"
                  className="search-button"
              >

                Search

              </button>



            </form>


          </div>


        </section>






        {/* FOOD RESULTS */}


        <FoodDisplay

            category={category}

            searchText={searchText}

        />



      </main>

  );

};


export default ExploreFood;