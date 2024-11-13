import { Navigate } from "react-router-dom";
import authServices from "../services/authServices";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { handleError } from "../utils/handleError";


const AdminRoute: React.FC<{ children: JSX.Element }>  = ({ children }) => {
    const isAuthenticated = authServices.isAuthenticated();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    authServices.isAdmin().then((response) => {
        setIsAdmin(response);
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await authServices.isAdmin();
                setIsAdmin(response);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <Spin size="large" />;
    }

    
    return isAuthenticated && isAdmin ? children : <Navigate to="/home" />;
}

export default AdminRoute;
