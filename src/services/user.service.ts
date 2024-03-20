import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

interface IUserClinic {
  id: number;
  name: string;
}

export interface IUserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  clinic_id: number;
  clinic: IUserClinic;
}

interface IUserCreate {
  email: string;
  password: string;
  name: string;
  role: string;
  clinic_id: number;
}

interface IUserUpdate extends Partial<IUserCreate> {}

export const getAllUserWithPagination = async (pagination?: IPagination) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IUserResponse>,
      any
    > = await axios.get("/user", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
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
    throw error;
  }
};

export const getUserByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IUserResponse[], any> = await axios.get(
      "/user",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createUser = async (userDTO: IUserCreate) => {
  try {
    const response = await axios.post("/user", userDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateUser = async (userId: number, userDTO: IUserUpdate) => {
  try {
    const response = await axios.put(`/user/${userId}`, userDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    await axios.delete(`/user/${userId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
