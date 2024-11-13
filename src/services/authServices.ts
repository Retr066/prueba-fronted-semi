import { LoginData, RegisterData, ResponseLogin, ResponseRefreshToken } from "../interfaces/auth.interface";
import { Response } from '../interfaces/response.interface';
import { User } from "../models/user.model";
import axiosInstance from "../utils/axiosConfig";
import userServices from "./userServices";


class AuthService {
    async login(data: LoginData): Promise<Response<ResponseLogin>> {
        const response = await axiosInstance.post<Response<ResponseLogin>>('/auth/login', data);
        const { token, refreshToken } = response.data.data as ResponseLogin;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        return response.data;
    }

    async register(data: RegisterData): Promise<Response> {
        const response = await axiosInstance.post<Promise<Response>>('/auth/register', data);
        return response.data;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    async refreshToken(): Promise<ResponseRefreshToken> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No se encontró el refreshToken');
        }
        const response = await axiosInstance.post<Response<ResponseRefreshToken>>('/auth/refresh-token', { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data.data as ResponseRefreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        return { token, refreshToken: newRefreshToken };
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // window.location.href = '/login';
    }

    async isAdmin(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        //TODO hacerlo por api
        const getUser: User = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await userServices.getUser(getUser.id);
        return  response.data?.tipo_usuario === 'ADMIN';
    }
}

export default new AuthService();
