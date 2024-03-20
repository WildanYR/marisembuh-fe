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
    const params = new URLSearchParams();
    params.append("with-meridian", "true");
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IComplaintResponse>,
      any
    > = await axios.get("/complaint", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getComplaintById = async (complaintId: number) => {
  try {
    const params = new URLSearchParams();
    params.append("with-meridian", "true");
    const response: AxiosResponse<IComplaintResponse, any> = await axios.get(
      `/complaint/${complaintId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getComplaintByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IComplaintResponse[], any> = await axios.get(
      "/complaint",
      { params }
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
