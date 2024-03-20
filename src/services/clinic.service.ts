import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IClinicResponse {
  id: number;
  name: string;
}

interface IClinicCreate {
  name: string;
}

interface IClinicUpdate extends Partial<IClinicCreate> {}

export const getAllClinicWithPagination = async (pagination?: IPagination) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IClinicResponse>,
      any
    > = await axios.get("/clinic", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getClinicById = async (clinicId: number) => {
  try {
    const response: AxiosResponse<IClinicResponse, any> = await axios.get(
      `/clinic/${clinicId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getClinicByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IClinicResponse[], any> = await axios.get(
      "/clinic",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createClinic = async (clinicDTO: IClinicCreate) => {
  try {
    const response = await axios.post("/clinic", clinicDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateClinic = async (
  clinicId: number,
  clinicDTO: IClinicUpdate
) => {
  try {
    const response = await axios.put(`/clinic/${clinicId}`, clinicDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteClinic = async (clinicId: number) => {
  try {
    await axios.delete(`/clinic/${clinicId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
