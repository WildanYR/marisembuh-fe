import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IStomachCheckupResponse {
  id: number;
  name: string;
}

interface IStomachCheckupCreate {
  name: string;
}

interface IStomachCheckupUpdate extends Partial<IStomachCheckupCreate> {}

export const getAllStomachCheckupWithPagination = async (
  pagination?: IPagination
) => {
  try {
    let uri = "/stomach-checkup";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IStomachCheckupResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getStomachCheckupById = async (stomachcheckupId: number) => {
  try {
    const response: AxiosResponse<IStomachCheckupResponse, any> =
      await axios.get(`/stomach-checkup/${stomachcheckupId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getStomachCheckupByName = async (query: string) => {
  try {
    const response: AxiosResponse<IStomachCheckupResponse[], any> =
      await axios.get(`/stomach-checkup?s=${query}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createStomachCheckup = async (
  stomachcheckupDTO: IStomachCheckupCreate
) => {
  try {
    await axios.post("/stomach-checkup", stomachcheckupDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateStomachCheckup = async (
  stomachcheckupId: number,
  stomachcheckupDTO: IStomachCheckupUpdate
) => {
  try {
    await axios.put(`/stomach-checkup/${stomachcheckupId}`, stomachcheckupDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteStomachCheckup = async (stomachcheckupId: number) => {
  try {
    await axios.delete(`/stomach-checkup/${stomachcheckupId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
