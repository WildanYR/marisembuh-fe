import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IUserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface IUserCreate {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface IUserUpdate extends Partial<IUserCreate> {}

export const getAllUserWithPagination = async (pagination?: IPagination) => {
  try {
    let uri = "/user";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IUserResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getUserById = async (userId: number) => {
  try {
    const response: AxiosResponse<IUserResponse, any> = await axios.get(
      `/user/${userId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getUserByName = async (query: string) => {
  try {
    const response: AxiosResponse<IUserResponse[], any> = await axios.get(
      `/user?s=${query}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createUser = async (userDTO: IUserCreate) => {
  try {
    const response = await axios.post("/user", userDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateUser = async (userId: number, userDTO: IUserUpdate) => {
  try {
    const response = await axios.put(`/user/${userId}`, userDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteUser = async (userId: number) => {
  try {
    await axios.delete(`/user/${userId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
