import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IMeridianResponse {
  id: number;
  name: string;
}

interface IMeridianCreate {
  name: string;
}

interface IMeridianUpdate extends Partial<IMeridianCreate> {}

export const getAllMeridianWithPagination = async (
  pagination?: IPagination
) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IMeridianResponse>,
      any
    > = await axios.get("/meridian", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getMeridianById = async (meridianId: number) => {
  try {
    const response: AxiosResponse<IMeridianResponse, any> = await axios.get(
      `/meridian/${meridianId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getMeridianByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IMeridianResponse[], any> = await axios.get(
      "/meridian",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createMeridian = async (meridianDTO: IMeridianCreate) => {
  try {
    const response: AxiosResponse<IMeridianResponse, any> = await axios.post(
      "/meridian",
      meridianDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateMeridian = async (
  meridianId: number,
  meridianDTO: IMeridianUpdate
) => {
  try {
    const response = await axios.put(`/meridian/${meridianId}`, meridianDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteMeridian = async (meridianId: number) => {
  try {
    await axios.delete(`/meridian/${meridianId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
