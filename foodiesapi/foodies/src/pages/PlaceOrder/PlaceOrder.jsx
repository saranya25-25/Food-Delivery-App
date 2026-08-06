import { useContext, useState } from "react";
import "./PlaceOrder.css";

import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

import { calculateCartTotals } from "../../util/cartUtils";
import { RAZORPAY_KEY } from "../../util/contants";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  createOrder,
  deleteOrder,
  verifyPayment,
} from "../../service/orderService";

import { clearCartItems } from "../../service/cartService";


const PlaceOrder = () => {


  const {
    foodList,
    quantities,
    setQuantities,
    token,
  } = useContext(StoreContext);


  const navigate = useNavigate();



  const [data, setData] = useState({

    firstName:"",
    lastName:"",
    email:"",
    phoneNumber:"",
    address:"",
    state:"",
    city:"",
    zip:"",

  });



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





  const onChangeHandler = (event)=>{

    const {
      name,
      value

    } = event.target;


    setData(prev=>({

      ...prev,
      [name]:value

    }));

  };






  const clearCart = async()=>{

    try{

      await clearCartItems(
          token,
          setQuantities
      );

    }

    catch{

      toast.error(
          "Unable to clear cart"
      );

    }

  };






  const deleteOrderHandler = async(orderId)=>{

    try{

      await deleteOrder(
          orderId,
          token
      );

    }

    catch(error){

      console.log(error);

    }

  };







  const verifyPaymentHandler = async(response)=>{


    const paymentData = {

      razorpay_payment_id:
      response.razorpay_payment_id,

      razorpay_order_id:
      response.razorpay_order_id,

      razorpay_signature:
      response.razorpay_signature,

    };



    try{


      const success =
          await verifyPayment(
              paymentData,
              token
          );



      if(success){


        toast.success(
            "Payment successful 🎉"
        );


        await clearCart();


        navigate("/myorders");


      }

      else{


        toast.error(
            "Payment verification failed"
        );


        navigate("/");

      }



    }

    catch{


      toast.error(
          "Payment failed"
      );


    }


  };









  const initiateRazorpayPayment = (order)=>{


    if(!window.Razorpay){

      toast.error(
          "Payment gateway unavailable"
      );

      return;

    }



    const options = {


      key: RAZORPAY_KEY,


      amount:
      order.amount,


      currency:"INR",


      name:"Foodies",


      description:
          "Food order payment",



      order_id:
      order.razorpayOrderId,



      handler:
      verifyPaymentHandler,



      prefill:{


        name:
            `${data.firstName} ${data.lastName}`,


        email:data.email,


        contact:data.phoneNumber,


      },



      theme:{

        color:"#ff6347"

      },



      modal:{


        ondismiss:()=>{

          deleteOrderHandler(order.id);

        }

      }


    };



    const razorpay =
        new window.Razorpay(options);


    razorpay.open();


  };









  const onSubmitHandler = async(event)=>{


    event.preventDefault();



    const orderData = {


      userAddress:

          `${data.firstName} ${data.lastName},
      ${data.address},
      ${data.city},
      ${data.state},
      ${data.zip}`,



      phoneNumber:
      data.phoneNumber,



      email:
      data.email,



      orderedItems:

          cartItems.map(item=>({

            foodId:item.id,

            quantity:
                quantities[item.id],

            price:
                item.price * quantities[item.id],

            category:
            item.category,

            imageUrl:
            item.imageUrl,

            description:
            item.description,

            name:
            item.name,


          })),



      amount:
          total.toFixed(2),



      orderStatus:
          "Preparing"

    };





    try{


      const response =
          await createOrder(
              orderData,
              token
          );



      if(response.razorpayOrderId){


        initiateRazorpayPayment(
            response
        );


      }

      else{


        toast.error(
            "Unable to create order"
        );


      }


    }

    catch{


      toast.error(
          "Unable to place order"
      );


    }


  };







  return (

      <div className="container mt-4">

        <main>


          <div className="text-center py-5">


            <img

                src={assets.logo}

                alt="Foodies"

                width="98"

                height="98"

            />


          </div>





          <div className="row g-5">



            {/* CART SUMMARY */}


            <div className="col-md-5 col-lg-4 order-md-last">


              <h4 className="mb-3">

                Your Cart

                <span className="badge bg-primary ms-2">

                {cartItems.length}

              </span>

              </h4>




              <ul className="list-group">


                {
                  cartItems.map(item=>(


                      <li

                          key={item.id}

                          className="list-group-item d-flex justify-content-between"

                      >


                        <div>


                          <h6>

                            {item.name}

                          </h6>


                          <small>

                            Qty:
                            {quantities[item.id]}

                          </small>


                        </div>



                        <span>

                      ₹
                          {
                              item.price *
                              quantities[item.id]
                          }

                    </span>


                      </li>


                  ))
                }






                <li className="list-group-item d-flex justify-content-between">


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


                </li>





                <li className="list-group-item d-flex justify-content-between">


                <span>
                  Tax
                </span>


                  <span>

                  ₹{tax.toFixed(2)}

                </span>


                </li>





                <li className="list-group-item d-flex justify-content-between">


                  <strong>
                    Total
                  </strong>


                  <strong>

                    ₹{total.toFixed(2)}

                  </strong>


                </li>



              </ul>


            </div>









            {/* ADDRESS FORM */}



            <div className="col-md-7 col-lg-8">


              <h4 className="mb-3">

                Billing Address

              </h4>



              <form onSubmit={onSubmitHandler}>


                <div className="row g-3">


                  {
                    [
                      ["firstName","First Name","text"],
                      ["lastName","Last Name","text"],
                      ["email","Email","email"],
                      ["phoneNumber","Phone Number","number"],
                      ["address","Address","text"],
                      ["state","State","text"],
                      ["city","City","text"],
                      ["zip","Zip","number"]

                    ].map(([name,label,type])=>(


                        <div className="col-md-6" key={name}>


                          <label className="form-label">

                            {label}

                          </label>



                          <input

                              type={type}

                              className="form-control"

                              name={name}

                              value={data[name]}

                              onChange={onChangeHandler}

                              required

                          />


                        </div>


                    ))
                  }


                </div>




                <hr className="my-4"/>




                <button

                    className="w-100 btn btn-primary btn-lg"

                    disabled={
                        cartItems.length===0
                    }

                >

                  Continue to Checkout 💳


                </button>




              </form>



            </div>



          </div>



        </main>


      </div>

  );

};


export default PlaceOrder;