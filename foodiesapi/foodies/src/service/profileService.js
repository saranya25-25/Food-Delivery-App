import axios from "axios";
const API_URL = "https://food-delivery-project-2y1g.onrender.com/api";
// =========================================================
// GET PROFILE
// =========================================================
export const fetchProfile = async (token) => {
    const response = await axios.get(
        `${API_URL}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
// =========================================================
// UPDATE PROFILE
// =========================================================
export const updateProfile = async (
    profileData,
    token
) => {
    const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};
// =========================================================
// UPLOAD / REPLACE PROFILE IMAGE
// =========================================================
export const uploadProfileImage = async (
    file,
    token
) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
        `${API_URL}/profile/image`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
// =========================================================
// DELETE PROFILE IMAGE
// =========================================================
export const deleteProfileImage = async (
    token
) => {
    const response = await axios.delete(
        `${API_URL}/profile/image`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};