import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from './userSlice';
import themeReducer from './themeSlice';
import { User } from '../models/user.model';
import userServices from '../services/userServices';

const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


const fetchUser = async () => {
    const getUser: User = JSON.parse(localStorage.getItem('user') || '{}');
    if (getUser) {
        const response = await userServices.getUser(getUser.id);
        if(response.data) {
            store.dispatch(setUser(response.data));
        }
    }
}

fetchUser();
export default store;
