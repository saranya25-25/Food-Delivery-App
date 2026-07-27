import { useState } from "react";

import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

import "./Home.css";


const Home = () => {


    const [category, setCategory] = useState("All");


    return (

        <main className="home-page">


            {/* Hero Section */}

            <section className="hero-section">

                <div className="container">

                    <Header />

                </div>

            </section>



            {/* Category Explorer */}

            <section className="home-section explore-section">

                <div className="container">

                    <ExploreMenu
                        category={category}
                        setCategory={setCategory}
                    />

                </div>

            </section>




            {/* Food Listing */}

            <section className="home-section food-section">
                <div className="container">

                <FoodDisplay

                    category={category}

                    searchText=""

                />
                </div>


            </section>



        </main>

    );

};


export default Home;