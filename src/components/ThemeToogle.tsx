import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import 'tailwindcss/tailwind.css';
import { toggleTheme } from '../store/themeSlice';

const ThemeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const {theme} = useSelector((state: RootState) => state.theme);

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full focus:outline-none ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
            }`}
        >
            {theme === 'dark' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
