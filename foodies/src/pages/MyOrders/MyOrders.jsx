import { useContext, useEffect, useState } from "react";

import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

import { fetchUserOrders } from "../../service/orderService";

import "./MyOrders.css";


const MyOrders = () => {


  const { token } = useContext(StoreContext);


  const [data,setData] = useState([]);

  const [loading,setLoading] = useState(false);





  const fetchOrders = async()=>{


    try{


      setLoading(true);


      const response =
          await fetchUserOrders(token);


      setData(response || []);



    }

    catch(error){


      console.log(
          "Order fetch error",
          error
      );


    }

    finally{

      setLoading(false);

    }


  };







  useEffect(()=>{


    if(token){

      fetchOrders();

    }


  },[token]);








  if(loading){


    return (

        <div className="orders-loading">

          Loading orders... 🍔

        </div>

    );


  }







  return (


      <main className="orders-page">


        <div className="container py-5">



          <h1 className="orders-title">

            My Orders 🍔

          </h1>





          {

            data.length===0 ?


                <div className="empty-orders">


                  <i className="bi bi-bag-x"></i>


                  <h3>
                    No orders yet
                  </h3>


                  <p>
                    Your delicious meals will appear here.
                  </p>


                </div>



                :


                <div className="orders-wrapper">



                  {
                    data.map((order,index)=>(


                        <div
                            className="order-card"
                            key={index}
                        >



                          <div className="delivery-box">


                            <img

                                src={assets.delivery}

                                alt="delivery"

                            />


                          </div>






                          <div className="order-info">


                            <h5>


                              {
                                order.orderedItems.map(
                                    (item,i)=>

                                        `${item.name} x ${item.quantity}${
                                            i !== order.orderedItems.length-1
                                                ? ", "
                                                :""
                                        }`

                                )

                              }


                            </h5>



                            <p>

                              Items:
                              {" "}
                              {order.orderedItems.length}

                            </p>


                          </div>







                          <div className="order-total">


                            ₹
                            {Number(order.amount).toFixed(2)}


                          </div>








                          <div

                              className={`order-status 
${order.orderStatus
                                  .toLowerCase()
                                  .replaceAll(" ","-")}`}

                          >


                            ● {order.orderStatus}


                          </div>






                          <button

                              className="refresh-btn"

                              onClick={fetchOrders}

                          >


                            <i className="bi bi-arrow-clockwise"></i>


                          </button>




                        </div>


                    ))

                  }



                </div>


          }



        </div>


      </main>


  );


};


export default MyOrders;