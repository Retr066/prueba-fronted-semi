import React from 'react';
import { Navigate } from 'react-router-dom';
import authServices from '../services/authServices';

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const isAuthenticated = authServices.isAuthenticated();

    return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
