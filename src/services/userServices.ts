import { Pagination } from "../interfaces/pagination.interface";
import { Response } from "../interfaces/response.interface";
import { User, UsersResponse, UserUpdate } from "../models/user.model";
import axiosInstance from "../utils/axiosConfig";


class UserService {
  async getUsers(pagination: Pagination): Promise<Response<UsersResponse>> {
        const response = await axiosInstance.get<Response<UsersResponse>>('/users', {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                ...pagination.filter,
            },
        });

        return response.data;

  }

  async getUser(id: number): Promise<Response<User>> {
    const response = await axiosInstance.get<Response<User>>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: UserUpdate): Promise<Response> {
    const response = await axiosInstance.put<Response>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<Response> {
    const response = await axiosInstance.delete<Response>(`/users/${id}`);
    return response.data;
  }

  async getUsersOnlyAdmin(pagination: Pagination): Promise<Response<UsersResponse>> {
    const response = await axiosInstance.get<Response<UsersResponse>>('/users/admin', {
        params: {
            page: pagination.page,
            limit: pagination.limit,
            ...pagination.filter,
        },
    });

    return response.data;
  }

}

export default new UserService();
