import {
  useContext,
  useEffect,
  useState,
} from "react";

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

import {
  fetchProfile,
  updateProfile,
} from "../../service/profileService";


const PlaceOrder = () => {

  const {
    foodList,
    quantities,
    setQuantities,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();


  // =========================================================
  // ADDRESS FORM DATA
  // =========================================================

  const [data, setData] = useState({

    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",

  });


  // =========================================================
  // SAVED ADDRESS
  // =========================================================

  const [savedAddress, setSavedAddress] =
      useState("");


  const [loadingProfile, setLoadingProfile] =
      useState(true);


  const [useSavedAddress, setUseSavedAddress] =
      useState(false);


  const [editingAddress, setEditingAddress] =
      useState(false);


  // =========================================================
  // CART
  // =========================================================

  const cartItems = foodList.filter(
      (food) => quantities[food.id] > 0
  );


  const {
    subtotal,
    shipping,
    tax,
    total,
  } = calculateCartTotals(
      cartItems,
      quantities
  );


  // =========================================================
  // LOAD USER PROFILE
  // =========================================================

  useEffect(() => {

    const loadProfile = async () => {

      if (!token) {

        setLoadingProfile(false);

        return;
      }


      try {

        setLoadingProfile(true);


        const profile =
            await fetchProfile(token);


        // Set email automatically
        setData((prev) => ({

          ...prev,

          email: profile.email || "",

        }));


        // Check saved address
        if (
            profile.address &&
            profile.address.trim() !== ""
        ) {

          setSavedAddress(
              profile.address
          );

          // By default show saved address
          setUseSavedAddress(true);

          setEditingAddress(false);

        } else {

          // No saved address
          setSavedAddress("");

          setUseSavedAddress(false);

          setEditingAddress(true);
        }


      } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        toast.error(
            "Unable to load profile"
        );

        // If profile cannot load,
        // allow address form
        setEditingAddress(true);

      } finally {

        setLoadingProfile(false);

      }

    };


    loadProfile();

  }, [token]);


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const onChangeHandler = (event) => {

    const {
      name,
      value,
    } = event.target;


    setData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  // =========================================================
  // USE SAVED ADDRESS
  // =========================================================

  const handleUseSavedAddress = () => {

    if (!savedAddress) {

      toast.error(
          "No saved address available"
      );

      return;
    }


    setUseSavedAddress(true);

    setEditingAddress(false);


    toast.success(
        "Saved address selected ✓"
    );

  };


  // =========================================================
  // EDIT ADDRESS
  // =========================================================

  const handleEditAddress = () => {

    setUseSavedAddress(false);

    setEditingAddress(true);

  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {

    if (savedAddress) {

      setUseSavedAddress(true);

      setEditingAddress(false);

    }

  };


  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = async () => {

    try {

      await clearCartItems(
          token,
          setQuantities
      );

    } catch (error) {

      console.error(
          "Unable to clear cart:",
          error
      );

      toast.error(
          "Unable to clear cart"
      );

    }

  };


  // =========================================================
  // DELETE ORDER
  // =========================================================

  const deleteOrderHandler = async (
      orderId
  ) => {

    try {

      await deleteOrder(
          orderId,
          token
      );

    } catch (error) {

      console.error(
          "Delete order error:",
          error
      );

    }

  };


  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  const verifyPaymentHandler = async (
      response
  ) => {

    const paymentData = {

      razorpay_payment_id:
      response.razorpay_payment_id,

      razorpay_order_id:
      response.razorpay_order_id,

      razorpay_signature:
      response.razorpay_signature,

    };


    try {

      const success =
          await verifyPayment(
              paymentData,
              token
          );


      if (success) {

        toast.success(
            "Payment successful 🎉"
        );


        await clearCart();


        navigate("/myorders");

      } else {

        toast.error(
            "Payment verification failed"
        );

        navigate("/");

      }

    } catch (error) {

      console.error(
          "Payment verification error:",
          error
      );

      toast.error(
          "Payment failed"
      );

    }

  };


  // =========================================================
  // RAZORPAY
  // =========================================================

  const initiateRazorpayPayment = (
      order
  ) => {

    if (!window.Razorpay) {

      toast.error(
          "Payment gateway unavailable"
      );

      return;

    }


    const options = {

      key: RAZORPAY_KEY,

      amount: order.amount,

      currency: "INR",

      name: "Foodies",

      description:
          "Food order payment",

      order_id:
      order.razorpayOrderId,


      handler:
      verifyPaymentHandler,


      prefill: {

        name:
            `${data.firstName} ${data.lastName}`,

        email:
        data.email,

        contact:
        data.phoneNumber,

      },


      theme: {

        color: "#ff6347",

      },


      modal: {

        ondismiss: () => {

          deleteOrderHandler(
              order.id
          );

        },

      },

    };


    const razorpay =
        new window.Razorpay(
            options
        );


    razorpay.open();

  };


  // =========================================================
  // CREATE FINAL ADDRESS
  // =========================================================

  const getOrderAddress = () => {

    // If user selected saved address
    if (
        useSavedAddress &&
        savedAddress
    ) {

      return savedAddress;

    }


    // Otherwise create new address
    return (
        `${data.firstName} ${data.lastName}, ` +
        `${data.address}, ` +
        `${data.city}, ` +
        `${data.state}, ` +
        `${data.zip}`
    );

  };


  // =========================================================
  // SAVE ADDRESS TO PROFILE
  // =========================================================

  const saveAddressToProfile = async (
      address
  ) => {

    try {

      await updateProfile(

          {
            address: address,
          },

          token

      );


      setSavedAddress(address);


    } catch (error) {

      console.error(
          "Unable to save address:",
          error
      );


      toast.error(
          "Order placed, but address could not be saved"
      );

    }

  };


  // =========================================================
  // SUBMIT ORDER
  // =========================================================

  const onSubmitHandler = async (
      event
  ) => {

    event.preventDefault();


    // =======================================================
    // VALIDATE PHONE
    // =======================================================

    if (
        !data.phoneNumber ||
        data.phoneNumber.trim() === ""
    ) {

      toast.error(
          "Please enter your phone number"
      );

      return;

    }


    // =======================================================
    // GET ADDRESS
    // =======================================================

    const finalAddress =
        getOrderAddress();


    if (
        !finalAddress ||
        finalAddress.trim() === ""
    ) {

      toast.error(
          "Please provide a delivery address"
      );

      return;

    }


    // =======================================================
    // IF NEW / EDITED ADDRESS -> SAVE IT
    // =======================================================

    if (!useSavedAddress) {

      await saveAddressToProfile(
          finalAddress
      );

    }


    // =======================================================
    // ORDER DATA
    // =======================================================

    const orderData = {

      userAddress:
      finalAddress,

      phoneNumber:
      data.phoneNumber,

      email:
      data.email,


      orderedItems:

          cartItems.map((item) => ({

            foodId:
            item.id,

            quantity:
                quantities[item.id],

            price:
                item.price *
                quantities[item.id],

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
          "Preparing",

    };


    // =======================================================
    // CREATE ORDER
    // =======================================================

    try {

      const response =
          await createOrder(
              orderData,
              token
          );


      if (
          response?.razorpayOrderId
      ) {

        initiateRazorpayPayment(
            response
        );

      } else {

        toast.error(
            "Unable to create order"
        );

      }

    } catch (error) {

      console.error(
          "Create order error:",
          error
      );

      toast.error(
          "Unable to place order"
      );

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loadingProfile) {

    return (

        <div className="checkout-loading">

          <div className="checkout-loader">
            🍔
          </div>

          <p>
            Loading your saved address...
          </p>

        </div>

    );

  }


  // =========================================================
  // JSX
  // =========================================================

  return (

      <div className="container place-order-page">

        <main>

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="text-center py-5">

            <img
                src={assets.logo}
                alt="Foodies"
                width="98"
                height="98"
            />

          </div>


          <div className="row g-5">


            {/* =================================================
                CART SUMMARY
            ================================================= */}

            <div className="col-md-5 col-lg-4 order-md-last">

              <h4 className="mb-3">

                Your Cart

                <span className="badge bg-primary ms-2">

                  {cartItems.length}

                </span>

              </h4>


              <ul className="list-group">

                {cartItems.map((item) => (

                    <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between"
                    >

                      <div>

                        <h6>
                          {item.name}
                        </h6>

                        <small>
                          Qty: {
                          quantities[item.id]
                        }
                        </small>

                      </div>


                      <span>

                        ₹
                        {(
                            item.price *
                            quantities[item.id]
                        ).toFixed(2)}

                      </span>

                    </li>

                ))}


                <li className="list-group-item d-flex justify-content-between">

                  <span>
                    Shipping
                  </span>

                  <span>

                    ₹
                    {subtotal === 0
                        ? "0.00"
                        : shipping.toFixed(2)}

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


            {/* =================================================
                CHECKOUT
            ================================================= */}

            <div className="col-md-7 col-lg-8">

              <h4 className="mb-3">
                Delivery Address
              </h4>


              {/* =================================================
                  SAVED ADDRESS
              ================================================= */}

              {savedAddress && !editingAddress && (

                  <div className="saved-address-card">

                    <div className="saved-address-header">

                      <div>

                        <span className="saved-icon">
                          📍
                        </span>

                        <div>

                          <h5>
                            Saved Address
                          </h5>

                          <p>
                            Use your previously saved
                            delivery address
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="saved-address-content">

                      <div className="address-check-icon">

                        {useSavedAddress
                            ? "✓"
                            : "📍"}

                      </div>


                      <div className="saved-address-text">

                        {savedAddress}

                      </div>

                    </div>


                    <div className="saved-address-actions">


                      <button
                          type="button"
                          className={
                            useSavedAddress
                                ? "saved-use-btn active"
                                : "saved-use-btn"
                          }
                          onClick={
                            handleUseSavedAddress
                          }
                      >

                        ✓ Use Saved Address

                      </button>


                      <button
                          type="button"
                          className="edit-address-btn"
                          onClick={
                            handleEditAddress
                          }
                      >

                        ✏️ Edit Address

                      </button>


                    </div>

                  </div>

              )}


              {/* =================================================
                  PHONE NUMBER
              ================================================= */}

              {savedAddress && !editingAddress && (

                  <div className="phone-card">

                    <label className="form-label">

                      Phone Number

                    </label>


                    <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={
                          data.phoneNumber
                        }
                        onChange={
                          onChangeHandler
                        }
                        placeholder="Enter phone number"
                        required
                    />

                    <small>
                      Required for delivery and payment.
                    </small>

                  </div>

              )}


              {/* =================================================
                  ADDRESS FORM
              ================================================= */}

              {editingAddress && (

                  <form
                      onSubmit={
                        onSubmitHandler
                      }
                  >

                    <div className="row g-3">


                      {/* FIRST NAME */}

                      <div className="col-md-6">

                        <label className="form-label">
                          First Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={
                              data.firstName
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="Enter first name"
                            required
                        />

                      </div>


                      {/* LAST NAME */}

                      <div className="col-md-6">

                        <label className="form-label">
                          Last Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={
                              data.lastName
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="Enter last name"
                            required
                        />

                      </div>


                      {/* EMAIL */}

                      <div className="col-md-6">

                        <label className="form-label">
                          Email
                        </label>

                        <input
                            type="email"
                            className="form-control saved-email-input"
                            name="email"
                            value={
                              data.email
                            }
                            readOnly
                            disabled
                        />

                        <small>
                          Email from your profile
                        </small>

                      </div>


                      {/* PHONE */}

                      <div className="col-md-6">

                        <label className="form-label">
                          Phone Number
                        </label>

                        <input
                            type="tel"
                            className="form-control"
                            name="phoneNumber"
                            value={
                              data.phoneNumber
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="Enter phone number"
                            required
                        />

                      </div>


                      {/* ADDRESS */}

                      <div className="col-12">

                        <label className="form-label">
                          Address
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={
                              data.address
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="House no, street, area"
                            required
                        />

                      </div>


                      {/* CITY */}

                      <div className="col-md-4">

                        <label className="form-label">
                          City
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={
                              data.city
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="City"
                            required
                        />

                      </div>


                      {/* STATE */}

                      <div className="col-md-4">

                        <label className="form-label">
                          State
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={
                              data.state
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="State"
                            required
                        />

                      </div>


                      {/* ZIP */}

                      <div className="col-md-4">

                        <label className="form-label">
                          Zip
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="zip"
                            value={
                              data.zip
                            }
                            onChange={
                              onChangeHandler
                            }
                            placeholder="PIN code"
                            required
                        />

                      </div>


                    </div>


                    {/* =================================================
                        EDIT ACTIONS
                    ================================================= */}

                    <div className="address-edit-actions">

                      {savedAddress && (

                          <button
                              type="button"
                              className="cancel-edit-btn"
                              onClick={
                                handleCancelEdit
                              }
                          >

                            Cancel

                          </button>

                      )}


                      <button
                          type="submit"
                          className="w-100 btn btn-primary btn-lg"
                          disabled={
                              cartItems.length === 0
                          }
                      >

                        Continue to Checkout 💳

                      </button>

                    </div>

                  </form>

              )}


              {/* =================================================
                  SAVED ADDRESS CHECKOUT BUTTON
              ================================================= */}

              {savedAddress &&
                  !editingAddress && (

                      <button
                          type="button"
                          className="w-100 btn btn-primary btn-lg saved-checkout-btn"
                          disabled={
                              cartItems.length === 0 ||
                              !data.phoneNumber
                          }
                          onClick={
                            onSubmitHandler
                          }
                      >

                        Continue with Saved Address 💳

                      </button>

                  )}

            </div>

          </div>

        </main>

      </div>

  );

};


export default PlaceOrder;