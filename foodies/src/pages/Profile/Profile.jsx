import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import Cropper from "react-easy-crop";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";

import {
    fetchProfile,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage
} from "../../service/profileService";

import "./Profile.css";


const Profile = () => {

    const { token } = useContext(StoreContext);

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [profileImage, setProfileImage] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);

    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [crop, setCrop] = useState({
        x: 0,
        y: 0
    });

    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState(null);

    const [data, setData] = useState({
        name: "",
        email: "",
        address: ""
    });


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        const loadProfile = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                setLoading(true);

                const profile =
                    await fetchProfile(token);

                setData({
                    name: profile.name || "",
                    email: profile.email || "",
                    address: profile.address || ""
                });

                setProfileImage(
                    profile.profileImageUrl || ""
                );

            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

                toast.error(
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);

            }

        };

        loadProfile();

    }, [token]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const onChangeHandler = (event) => {

        const { name, value } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =====================================================
    // OPEN IMAGE MENU
    // =====================================================

    const handleEditClick = () => {

        setMenuOpen((prev) => !prev);

    };


    // =====================================================
    // REPLACE IMAGE
    // =====================================================

    const handleReplaceImage = () => {

        setMenuOpen(false);

        fileInputRef.current?.click();

    };


    // =====================================================
    // IMAGE SELECTED
    // =====================================================

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select an image"
            );

            return;
        }


        if (file.size > 10 * 1024 * 1024) {

            toast.error(
                "Image must be less than 10MB"
            );

            return;
        }


        const imageUrl =
            URL.createObjectURL(file);

        setSelectedImage(imageUrl);

        setCrop({
            x: 0,
            y: 0
        });

        setZoom(1);

        setCropModalOpen(true);

        event.target.value = "";

    };


    // =====================================================
    // CROP COMPLETE
    // =====================================================

    const onCropComplete = (
        croppedArea,
        croppedAreaPixels
    ) => {

        setCroppedAreaPixels(
            croppedAreaPixels
        );

    };


    // =====================================================
    // CREATE CROPPED IMAGE
    // =====================================================

    const createCroppedImage = async () => {

        if (
            !selectedImage ||
            !croppedAreaPixels
        ) {

            throw new Error(
                "Unable to crop image"
            );

        }


        const image =
            await createImage(
                selectedImage
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        const ctx =
            canvas.getContext("2d");


        canvas.width =
            croppedAreaPixels.width;

        canvas.height =
            croppedAreaPixels.height;


        ctx.drawImage(

            image,

            croppedAreaPixels.x,
            croppedAreaPixels.y,

            croppedAreaPixels.width,
            croppedAreaPixels.height,

            0,
            0,

            croppedAreaPixels.width,
            croppedAreaPixels.height

        );


        return new Promise(
            (resolve, reject) => {

                canvas.toBlob(

                    (blob) => {

                        if (!blob) {

                            reject(
                                new Error(
                                    "Unable to create image"
                                )
                            );

                            return;

                        }

                        resolve(blob);

                    },

                    "image/jpeg",

                    0.9

                );

            }
        );

    };


    // =====================================================
    // SAVE CROPPED IMAGE
    // =====================================================

    const handleCropSave = async () => {

        try {

            setUploading(true);


            const croppedBlob =
                await createCroppedImage();


            const file =
                new File(

                    [croppedBlob],

                    "profile-image.jpg",

                    {
                        type: "image/jpeg"
                    }

                );


            const response =
                await uploadProfileImage(
                    file,
                    token
                );


            setProfileImage(
                response.profileImageUrl
            );


            setCropModalOpen(false);

            setSelectedImage(null);

            toast.success(
                "Profile image updated 🎉"
            );


        } catch (error) {

            console.error(
                "Image upload error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to upload image"
            );

        } finally {

            setUploading(false);

        }

    };


    // =====================================================
    // CANCEL CROP
    // =====================================================

    const handleCropCancel = () => {

        setCropModalOpen(false);

        setSelectedImage(null);

        setZoom(1);

    };


    // =====================================================
    // DELETE IMAGE
    // =====================================================

    const handleDeleteImage = async () => {

        setMenuOpen(false);


        if (!profileImage) {

            toast.info(
                "No profile image to delete"
            );

            return;

        }


        try {

            setUploading(true);


            await deleteProfileImage(
                token
            );


            setProfileImage("");


            toast.success(
                "Profile image deleted 🗑️"
            );


        } catch (error) {

            console.error(
                "Delete image error:",
                error
            );

            toast.error(
                "Unable to delete image"
            );

        } finally {

            setUploading(false);

        }

    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);


            const updated =
                await updateProfile(
                    data,
                    token
                );


            setData({

                name:
                    updated.name || "",

                email:
                    updated.email || "",

                address:
                    updated.address || ""

            });


            toast.success(
                "Profile updated successfully 🎉"
            );


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            toast.error(
                "Unable to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="profile-loading">

                Loading profile... 👤

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <main className="profile-page">

            <div className="profile-container">


                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="profile-header">


                    <div className="profile-image-wrapper">


                        {profileImage ? (

                            <img
                                src={profileImage}
                                alt="Profile"
                                className="profile-image"
                            />

                        ) : (

                            <div className="profile-placeholder">

                                👤

                            </div>

                        )}


                        {/* EDIT BUTTON */}

                        <button
                            type="button"
                            className="profile-edit-btn"
                            onClick={handleEditClick}
                        >

                            ✏️

                        </button>


                        {/* IMAGE MENU */}

                        {menuOpen && (

                            <div className="profile-image-menu">


                                {/* REPLACE IMAGE */}

                                <button
                                    type="button"
                                    onClick={
                                        handleReplaceImage
                                    }
                                >

                                    <span>
                                        🖼️
                                    </span>

                                    <div>

                                        <strong>
                                            Replace Image
                                        </strong>

                                        <small>
                                            Choose a new photo
                                        </small>

                                    </div>

                                </button>


                                {/* DELETE IMAGE */}

                                {profileImage && (

                                    <button
                                        type="button"
                                        className="delete-image-option"
                                        onClick={
                                            handleDeleteImage
                                        }
                                    >

                                        <span>
                                            🗑️
                                        </span>

                                        <div>

                                            <strong>
                                                Delete Image
                                            </strong>

                                            <small>
                                                Remove profile photo
                                            </small>

                                        </div>

                                    </button>

                                )}

                            </div>

                        )}


                        {/* HIDDEN FILE INPUT */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                            hidden
                        />

                    </div>


                    <h1>

                        {data.name ||
                            "My Profile"}

                    </h1>


                    <p>

                        Manage your personal
                        information

                    </p>


                </div>


                {/* =================================================
                    PROFILE FORM
                ================================================= */}

                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                >


                    <div className="profile-section">


                        <h3>

                            👤 Personal Information

                        </h3>


                        {/* NAME */}

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={
                                onChangeHandler
                            }
                            placeholder="Enter your name"
                            required
                        />


                        {/* EMAIL */}

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            disabled
                        />


                        {/* ADDRESS */}

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={data.address}
                            onChange={
                                onChangeHandler
                            }
                            placeholder="Enter your address"
                        />

                    </div>


                    {/* SAVE BUTTON */}

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            uploading
                        }
                    >

                        {saving
                            ? "Saving..."
                            : "Save Profile"}

                    </button>


                </form>

            </div>


            {/* =================================================
                CROP MODAL
            ================================================= */}

            {cropModalOpen && (

                <div className="crop-modal-overlay">


                    <div className="crop-modal">


                        {/* HEADER */}

                        <div className="crop-header">


                            <div>

                                <h2>
                                    Adjust Photo
                                </h2>

                                <p>
                                    Move and zoom
                                    your image
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleCropCancel
                                }
                                className="crop-close"
                            >

                                ✕

                            </button>

                        </div>


                        {/* CROP AREA */}

                        <div className="crop-area">

                            <Cropper
                                image={selectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={
                                    setCrop
                                }
                                onZoomChange={
                                    setZoom
                                }
                                onCropComplete={
                                    onCropComplete
                                }
                            />

                        </div>


                        {/* ZOOM */}

                        <div className="zoom-control">


                            <span>
                                🔍
                            </span>


                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={zoom}
                                onChange={(event) =>
                                    setZoom(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            />


                            <span>
                                🔎
                            </span>


                        </div>


                        {/* ACTIONS */}

                        <div className="crop-actions">


                            <button
                                type="button"
                                className="crop-cancel-btn"
                                onClick={
                                    handleCropCancel
                                }
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                className="crop-save-btn"
                                onClick={
                                    handleCropSave
                                }
                                disabled={uploading}
                            >

                                {uploading
                                    ? "Uploading..."
                                    : "✓ Set Profile Photo"}

                            </button>


                        </div>


                    </div>

                </div>

            )}

        </main>

    );

};


// =====================================================
// IMAGE HELPER
// =====================================================

const createImage = (url) =>

    new Promise((resolve, reject) => {

        const image = new Image();


        image.addEventListener(
            "load",
            () => resolve(image)
        );


        image.addEventListener(
            "error",
            (error) => reject(error)
        );


        image.setAttribute(
            "crossOrigin",
            "anonymous"
        );


        image.src = url;

    });


export default Profile;