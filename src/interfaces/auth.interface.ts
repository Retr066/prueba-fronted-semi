import { User } from "../models/user.model";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    correo: string;
    name: string;
    password: string;
    lastname: string;
    second_lastname: string;
}



export interface ResponseLogin {
    token: string;
    refreshToken: string;
    user:User
}


export interface ResponseRefreshToken {
    token: string;
    refreshToken: string;
}
