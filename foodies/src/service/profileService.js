import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const fetchProfile = async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const updateProfile = async (profileData, token) => {
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