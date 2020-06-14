import axios from "axios";
import jwt_decode from "jwt-decode";

export const signup = (user) => {
    return axios
        .post("/api/signup", {
            email: user.email,
            password: user.password,
        })
        .then((response) => response.data)
        .then((response) => {
            if (response.ok) {
                localStorage.setItem("usertoken", response.access_token);
            } else {
                localStorage.removeItem("usertoken");
            }
            return response;
        })
        .catch((e) => console.log(e));
};

export const login = (user) => {
    return axios
        .post("/api/login", {
            email: user.email,
            password: user.password,
        })
        .then((response) => response.data)
        .then((response) => {
            if (response.ok) {
                localStorage.setItem("usertoken", response.access_token);
            } else {
                localStorage.removeItem("usertoken");
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const logout = () => {
    localStorage.removeItem("usertoken");
};

export const isLogged = () => {
    const token = localStorage.getItem("usertoken");
    return !!token;
};

export const getEmail = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
        const decoded = jwt_decode(token);
        return decoded.identity.email;
    }
};

export const postOrder = (order) => {
    return axios
        .post("/api/order", order)
        .then((response) => response.data)
        .catch((e) => console.log(e));
};
