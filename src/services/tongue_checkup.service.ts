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
    let uri = "/tongue-checkup";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<ITongueCheckupResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getTongueCheckupById = async (tonguecheckupId: number) => {
  try {
    const response: AxiosResponse<ITongueCheckupResponse, any> =
      await axios.get(`/tongue-checkup/${tonguecheckupId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getTongueCheckupByName = async (query: string) => {
  try {
    const response: AxiosResponse<ITongueCheckupResponse[], any> =
      await axios.get(`/tongue-checkup?s=${query}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createTongueCheckup = async (
  tonguecheckupDTO: ITongueCheckupCreate
) => {
  try {
    await axios.post("/tongue-checkup", tonguecheckupDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateTongueCheckup = async (
  tonguecheckupId: number,
  tonguecheckupDTO: ITongueCheckupUpdate
) => {
  try {
    await axios.put(`/tongue-checkup/${tonguecheckupId}`, tonguecheckupDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteTongueCheckup = async (tonguecheckupId: number) => {
  try {
    await axios.delete(`/tongue-checkup/${tonguecheckupId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
