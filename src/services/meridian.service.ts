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
    let uri = "/meridian";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IMeridianResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
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
  }
};

export const getMeridianByName = async (query: string) => {
  try {
    const response: AxiosResponse<IMeridianResponse[], any> = await axios.get(
      `/meridian?name=${query}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createMeridian = async (meridianDTO: IMeridianCreate) => {
  try {
    await axios.post("/meridian", meridianDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateMeridian = async (
  meridianId: number,
  meridianDTO: IMeridianUpdate
) => {
  try {
    await axios.put(`/meridian/${meridianId}`, meridianDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteMeridian = async (meridianId: number) => {
  try {
    await axios.delete(`/meridian/${meridianId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
