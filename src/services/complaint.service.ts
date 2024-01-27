import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IMeridianResponse } from "./meridian.service";

export interface IComplaintResponse {
  id: number;
  name: string;
  meridian: IMeridianResponse;
}

interface IComplaintCreate {
  name: string;
  meridianId?: number | null;
}

interface IComplaintUpdate extends Partial<IComplaintCreate> {}

export const getAllComplaintWithPagination = async (
  pagination?: IPagination
) => {
  try {
    let uri = "/complaint?with-meridian=true";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `&${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IComplaintResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getComplaintById = async (complaintId: number) => {
  try {
    const response: AxiosResponse<IComplaintResponse, any> = await axios.get(
      `/complaint/${complaintId}?with-meridian=true`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getComplaintByName = async (query: string) => {
  try {
    const response: AxiosResponse<IComplaintResponse[], any> = await axios.get(
      `/complaint?s=${query}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createComplaint = async (complaintDTO: IComplaintCreate) => {
  try {
    const response = await axios.post("/complaint", complaintDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateComplaint = async (
  complaintId: number,
  complaintDTO: IComplaintUpdate
) => {
  try {
    const response = await axios.put(`/complaint/${complaintId}`, complaintDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteComplaint = async (complaintId: number) => {
  try {
    await axios.delete(`/complaint/${complaintId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
