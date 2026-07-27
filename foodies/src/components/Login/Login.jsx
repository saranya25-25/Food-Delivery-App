import { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";


const Login = () => {

  const { setToken, loadCartData } = useContext(StoreContext);

  const navigate = useNavigate();


  const [data,setData] = useState({
    email:"",
    password:""
  });


  const [loading,setLoading] = useState(false);

  const [shake,setShake] = useState(false);



  const onChangeHandler = (e)=>{

    setData(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }));

  };



  const triggerShake = ()=>{

    setShake(true);

    setTimeout(()=>{
      setShake(false);
    },500);

  };



  const onSubmitHandler = async(e)=>{

    e.preventDefault();

    setLoading(true);


    try{

      const response = await login(data);


      if(response.status===200){

        setToken(response.data.token);

        localStorage.setItem(
            "token",
            response.data.token
        );


        await loadCartData(
            response.data.token
        );


        navigate("/");

      }


    }
    catch(error){

      console.log(error);

      toast.error(
          "Invalid email or password"
      );

      triggerShake();

    }
    finally{

      setLoading(false);

    }

  };



  return (

      <main className="login-page">


        <div className="login-overlay"></div>



        <section
            className={
              shake
                  ?
                  "food-login-card shake"
                  :
                  "food-login-card"
            }
        >



          <div className="login-logo">


            <img
                src={assets.logo}
                alt="Foodies"
            />


            <h2>
              Foodies
            </h2>


          </div>



          <h1>
            Welcome Back 🍔
          </h1>


          <p className="login-subtitle">
            Login to order your favourite meals
          </p>




          <form onSubmit={onSubmitHandler}>


            <div className="input-box">

              <i className="bi bi-envelope-fill"></i>

              <input
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  required
              />

            </div>




            <div className="input-box">


              <i className="bi bi-lock-fill"></i>


              <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  required
              />


            </div>




            <button
                type="submit"
                className="food-login-btn"
                disabled={loading}
            >

              {
                loading
                    ?
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Signing in...
                    </>
                    :
                    <>
                      Login
                      <i className="bi bi-arrow-right"></i>
                    </>
              }


            </button>





            <button
                type="reset"
                className="reset-btn"
            >

              Reset

            </button>



          </form>




          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>


          </p>



        </section>



      </main>

  );

};


export default Login;