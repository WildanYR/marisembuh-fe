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
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IStomachCheckupResponse>,
      any
    > = await axios.get("/stomach-checkup", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getStomachCheckupById = async (stomachcheckupId: number) => {
  try {
    const response: AxiosResponse<IStomachCheckupResponse, any> =
      await axios.get(`/stomach-checkup/${stomachcheckupId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getStomachCheckupByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IStomachCheckupResponse[], any> =
      await axios.get("/stomach-checkup", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createStomachCheckup = async (
  stomachcheckupDTO: IStomachCheckupCreate
) => {
  try {
    const response = await axios.post("/stomach-checkup", stomachcheckupDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateStomachCheckup = async (
  stomachcheckupId: number,
  stomachcheckupDTO: IStomachCheckupUpdate
) => {
  try {
    const response = await axios.put(
      `/stomach-checkup/${stomachcheckupId}`,
      stomachcheckupDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteStomachCheckup = async (stomachcheckupId: number) => {
  try {
    await axios.delete(`/stomach-checkup/${stomachcheckupId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
