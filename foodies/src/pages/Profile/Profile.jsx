import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";
import {
    fetchProfile,
    updateProfile,
} from "../../service/profileService";

import "./Profile.css";

const Profile = () => {
    const { token } = useContext(StoreContext);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!token) return;

            try {
                setLoading(true);

                const profile = await fetchProfile(token);

                setData({
                    name: profile.name || "",
                    email: profile.email || "",
                    phoneNumber: profile.phoneNumber || "",
                    address: profile.address || "",
                    city: profile.city || "",
                    state: profile.state || "",
                    zip: profile.zip || "",
                });
            } catch (error) {
                console.error("Profile loading error:", error);
                toast.error("Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [token]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            await updateProfile(data, token);

            toast.success("Profile updated successfully 🎉");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Unable to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile... 👤
            </div>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-container">
                <h1>My Profile 👤</h1>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-section">
                        <h3>Personal Information</h3>

                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={onChangeHandler}
                            placeholder="Enter your name"
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            disabled
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={data.phoneNumber}
                            onChange={onChangeHandler}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    <div className="profile-section">
                        <h3>Delivery Address 🏠</h3>

                        <label>Address</label>
                        <textarea
                            name="address"
                            value={data.address}
                            onChange={onChangeHandler}
                            placeholder="Enter your address"
                            required
                        />

                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={data.city}
                            onChange={onChangeHandler}
                            placeholder="Enter city"
                            required
                        />

                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={data.state}
                            onChange={onChangeHandler}
                            placeholder="Enter state"
                            required
                        />

                        <label>ZIP Code</label>
                        <input
                            type="text"
                            name="zip"
                            value={data.zip}
                            onChange={onChangeHandler}
                            placeholder="Enter ZIP code"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Profile;