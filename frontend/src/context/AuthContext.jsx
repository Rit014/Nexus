import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);


    const login = async (credentials) => {
        try {
            const res = await API.post("/users/login", credentials);
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("authUser", JSON.stringify(user));
            setUser(user);

            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data.message);
            } else {
                console.error("Network error:", error.message);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};