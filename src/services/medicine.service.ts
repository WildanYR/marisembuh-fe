import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IMedicineResponse {
  id: number;
  name: string;
}

interface IMedicineCreate {
  name: string;
}

interface IMedicineUpdate extends Partial<IMedicineCreate> {}

export const getAllMedicineWithPagination = async (
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
      IPaginationResponse<IMedicineResponse>,
      any
    > = await axios.get("/medicine", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getMedicineById = async (medicineId: number) => {
  try {
    const response: AxiosResponse<IMedicineResponse, any> = await axios.get(
      `/medicine/${medicineId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getMedicineByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IMedicineResponse[], any> = await axios.get(
      "/medicine",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createMedicine = async (medicineDTO: IMedicineCreate) => {
  try {
    const response = await axios.post("/medicine", medicineDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateMedicine = async (
  medicineId: number,
  medicineDTO: IMedicineUpdate
) => {
  try {
    const response = await axios.put(`/medicine/${medicineId}`, medicineDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteMedicine = async (medicineId: number) => {
  try {
    await axios.delete(`/medicine/${medicineId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
