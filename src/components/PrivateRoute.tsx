import React from 'react';
import { Navigate } from 'react-router-dom';
import authServices from '../services/authServices';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const isAuthenticated = authServices.isAuthenticated();

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
