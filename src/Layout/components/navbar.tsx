import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { RootState } from '../../store';
import { clearUser } from '../../store/userSlice';
import authServices from '../../services/authServices';
import ThemeToggle from '../../components/ThemeToogle';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
   

    const handleLogout = () => {
        dispatch(clearUser());
        authServices.logout();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between p-4 text-white bg-blue-500">
            <div className="text-lg font-bold"><Link to={'/home'}>Sistema de administración</Link></div>
            <div className="flex items-center">
                <ThemeToggle />
                <div className="mx-4">Hola, {user?.nombre}</div>
                <Button type="primary" onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
