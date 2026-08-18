import { useState } from "react";
import { assets } from "../../assets/assets";
import { addFood } from "../../services/foodService";
import { toast } from "react-toastify";

const AddFood = () => {
    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Biryani",
        price: "",
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Please select an image.");
            return;
        }

        try {
            await addFood(data, image);

            toast.success("Food added successfully!");

            setData({
                name: "",
                description: "",
                category: "Biryani",
                price: "",
            });

            setImage(null);
        } catch (error) {
            toast.error("Unable to add food.");
        }
    };

    return (
        <div className="container py-4">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div
                        className="card border-0 shadow-lg"
                        style={{
                            borderRadius: "20px",
                            overflow: "hidden",
                            animation: "fadeIn .5s ease",
                        }}
                    >

                        {/* Header */}

                        <div
                            style={{
                                background: "#0F172A",
                                padding: "25px",
                                textAlign: "center",
                            }}
                        >
                            <h2
                                style={{
                                    color: "#fff",
                                    marginBottom: "8px",
                                    fontWeight: "700",
                                }}
                            >
                                Add New Food
                            </h2>

                            <p
                                style={{
                                    color: "#cbd5e1",
                                    margin: 0,
                                }}
                            >
                                Add delicious food to your menu
                            </p>
                        </div>

                        {/* Body */}

                        <div className="card-body p-4">

                            <form onSubmit={onSubmitHandler}>

                                {/* Upload */}

                                <div className="text-center mb-4">

                                    <label htmlFor="image" style={{ cursor: "pointer" }}>

                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : assets.upload
                                            }
                                            alt="Upload"
                                            style={{
                                                width: "140px",
                                                height: "140px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "4px solid #10B981",
                                                transition: ".3s",
                                            }}
                                        />

                                    </label>

                                    <input
                                        hidden
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImage(e.target.files[0])
                                        }
                                    />

                                    <p className="text-muted mt-3">
                                        Click image to upload
                                    </p>

                                </div>

                                {/* Name */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Food Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Chicken Biryani"
                                        value={data.name}
                                        onChange={onChangeHandler}
                                        required
                                    />

                                </div>

                                {/* Description */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        name="description"
                                        placeholder="Write description..."
                                        value={data.description}
                                        onChange={onChangeHandler}
                                        required
                                    />

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Category
                                        </label>

                                        <select
                                            className="form-select"
                                            name="category"
                                            value={data.category}
                                            onChange={onChangeHandler}
                                        >
                                            <option>Biryani</option>
                                            <option>Pizza</option>
                                            <option>Burger</option>
                                            <option>North Indian</option>
                                            <option>South Indian</option>
                                            <option>Chicken</option>
                                            <option>Noodles</option>
                                            <option>Pasta</option>
                                            <option>Momos</option>
                                            <option>Rolls</option>
                                            <option>Sandwich</option>
                                            <option>Fries</option>
                                            <option>Salad</option>
                                            <option>Cake</option>
                                            <option>Ice cream</option>
                                        </select>

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Price (₹)
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            placeholder="200"
                                            value={data.price}
                                            onChange={onChangeHandler}
                                            required
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 py-3 fw-bold"
                                    style={{
                                        background: "#10B981",
                                        color: "#fff",
                                        borderRadius: "12px",
                                        border: "none",
                                        transition: ".3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#059669";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "#10B981";
                                    }}
                                >
                                    Save Food
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

            <style>{`

      @keyframes fadeIn{
        from{
          opacity:0;
          transform:translateY(20px);
        }
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      .form-control,
      .form-select{
        border-radius:12px;
        transition:.3s;
      }

      .form-control:focus,
      .form-select:focus{
        border-color:#10B981;
        box-shadow:0 0 10px rgba(16,185,129,.2);
      }

      textarea{
        resize:none;
      }

      img:hover{
        transform:scale(1.05);
      }

      `}</style>

        </div>
    );
};

export default AddFood;