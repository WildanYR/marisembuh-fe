import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface ITongueCheckupResponse {
  id: number;
  name: string;
}

interface ITongueCheckupCreate {
  name: string;
}

interface ITongueCheckupUpdate extends Partial<ITongueCheckupCreate> {}

export const getAllTongueCheckupWithPagination = async (
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
      IPaginationResponse<ITongueCheckupResponse>,
      any
    > = await axios.get("/tongue-checkup", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTongueCheckupById = async (tonguecheckupId: number) => {
  try {
    const response: AxiosResponse<ITongueCheckupResponse, any> =
      await axios.get(`/tongue-checkup/${tonguecheckupId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTongueCheckupByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<ITongueCheckupResponse[], any> =
      await axios.get("/tongue-checkup", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createTongueCheckup = async (
  tonguecheckupDTO: ITongueCheckupCreate
) => {
  try {
    const response = await axios.post("/tongue-checkup", tonguecheckupDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateTongueCheckup = async (
  tonguecheckupId: number,
  tonguecheckupDTO: ITongueCheckupUpdate
) => {
  try {
    const response = await axios.put(
      `/tongue-checkup/${tonguecheckupId}`,
      tonguecheckupDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteTongueCheckup = async (tonguecheckupId: number) => {
  try {
    await axios.delete(`/tongue-checkup/${tonguecheckupId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
