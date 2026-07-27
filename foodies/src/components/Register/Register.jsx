import { useState } from "react";
import "./Register.css";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "../../service/authService";
import { assets } from "../../assets/assets";



const getStrength = (password) => {

  let score = 0;

  if(password.length >= 6) score++;

  if(password.length >= 10) score++;

  if(/[A-Z]/.test(password)) score++;

  if(/[0-9]/.test(password)) score++;

  if(/[^A-Za-z0-9]/.test(password)) score++;


  return Math.min(score,4);

};





const strengthMeta = [

  { label:"", color:"" },

  { label:"Weak", color:"#dc3545" },

  { label:"Fair", color:"#fd7e14" },

  { label:"Good", color:"#ffc107" },

  { label:"Strong", color:"#198754" }

];






const Register = () => {


  const navigate = useNavigate();



  const [data,setData] = useState({

    name:"",
    email:"",
    password:""

  });



  const [loading,setLoading] = useState(false);


  const [shake,setShake] = useState(false);





  const strength = getStrength(data.password);






  const onChangeHandler = (event)=>{


    setData({

      ...data,

      [event.target.name]:event.target.value

    });


  };







  const triggerShake = ()=>{


    setShake(true);


    setTimeout(()=>{

      setShake(false);

    },500);


  };








  const onSubmitHandler = async(event)=>{


    event.preventDefault();


    setLoading(true);



    try{


      const response = await registerUser(data);



      if(response.status === 201){


        toast.success(
            "Registration completed. Please login."
        );


        navigate("/login");


      }

      else{


        toast.error(
            "Unable to register. Please try again"
        );


        triggerShake();


      }


    }

    catch(error){


      console.log(error);


      toast.error(
          "Unable to register. Please try again"
      );


      triggerShake();


    }


    finally{


      setLoading(false);


    }


  };









  return (



      <main className="register-page">



        <div className="register-overlay"></div>






        <div

            className={

              shake

                  ?

                  "food-register-card shake"

                  :

                  "food-register-card"

            }


        >





          <div className="register-logo">


            <img

                src={assets.logo}

                alt="Foodies"

            />



            <h2>

              Foodies

            </h2>



          </div>









          <h1>

            Create Account 🍕

          </h1>





          <p className="register-subtitle">


            Join Foodies and enjoy delicious meals



          </p>









          <form onSubmit={onSubmitHandler}>






            <div className="register-input-box">


              <i className="bi bi-person"></i>



              <input

                  type="text"

                  placeholder="Full Name"

                  name="name"

                  value={data.name}

                  onChange={onChangeHandler}

                  required

              />


            </div>









            <div className="register-input-box">


              <i className="bi bi-envelope"></i>




              <input

                  type="email"

                  placeholder="Email Address"

                  name="email"

                  value={data.email}

                  onChange={onChangeHandler}

                  required

              />


            </div>









            <div className="register-input-box">


              <i className="bi bi-lock"></i>



              <input

                  type="password"

                  placeholder="Password"

                  name="password"

                  value={data.password}

                  onChange={onChangeHandler}

                  required

              />



            </div>









            {

                data.password && (


                    <div className="strength-meter">


                      <div className="strength-track">


                        <div

                            className="strength-fill"

                            style={{

                              width:`${(strength/4)*100}%`,

                              backgroundColor:
                              strengthMeta[strength].color

                            }}


                        ></div>



                      </div>



                      <small

                          className="strength-label"

                          style={{

                            color:
                            strengthMeta[strength].color

                          }}

                      >

                        {strengthMeta[strength].label}


                      </small>



                    </div>



                )

            }









            <button

                className="food-register-btn"

                type="submit"

                disabled={loading}

            >


              {
                loading
                    ?
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                    :
                    <>
                      Create Account
                      <i className="bi bi-arrow-right"></i>
                    </>
              }




            </button>










            <button

                type="reset"

                className="register-reset-btn"

                disabled={loading}

            >


              Reset


            </button>









          </form>








          <p className="login-text">


            Already have an account?



            <Link to="/login">

              Sign In

            </Link>


          </p>






        </div>





      </main>



  );


};




export default Register;