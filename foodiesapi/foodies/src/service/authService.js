import axios from "axios";
import API_URL from "./api";
export const registerUser = (data) => {
    return axios.post(`${API_URL}/register`, data);
};
export const login = (data) => {
    return axios.post(`${API_URL}/login`, data);
};