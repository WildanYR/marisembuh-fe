import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface ITherapyResponse {
  id: number;
  name: string;
}

interface ITherapyCreate {
  name: string;
}

interface ITherapyUpdate extends Partial<ITherapyCreate> {}

export const getAllTherapyWithPagination = async (pagination?: IPagination) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<ITherapyResponse>,
      any
    > = await axios.get("/therapy", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTherapyById = async (therapyId: number) => {
  try {
    const response: AxiosResponse<ITherapyResponse, any> = await axios.get(
      `/therapy/${therapyId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTherapyByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<ITherapyResponse[], any> = await axios.get(
      "/therapy",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createTherapy = async (therapyDTO: ITherapyCreate) => {
  try {
    const response = await axios.post("/therapy", therapyDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateTherapy = async (
  therapyId: number,
  therapyDTO: ITherapyUpdate
) => {
  try {
    const response = await axios.put(`/therapy/${therapyId}`, therapyDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteTherapy = async (therapyId: number) => {
  try {
    await axios.delete(`/therapy/${therapyId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
