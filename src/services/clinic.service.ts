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

export interface IClinicStatistic {
  id: number;
  name: string;
  today_patient: number;
  month_patient: number;
}

export const getAllClinicWithPagination = async (pagination?: IPagination) => {
  try {
    let uri = "/clinic";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IClinicResponse>,
      any
    > = await axios.get(uri);
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
    const response: AxiosResponse<IClinicResponse[], any> = await axios.get(
      `/clinic?s=${query}`
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

export const getClinicStatistic = async (date?: Date) => {
  try {
    let url = "/clinic/statistic";
    if (date) {
      url += `?date=${date.toISOString()}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
