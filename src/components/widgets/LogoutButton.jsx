import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("oom-access-token");
            if (!token) {
                navigate("/login");
                return;
            }
            localStorage.removeItem("oom-access-token");
            localStorage.removeItem("oom-refresh-token");
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
