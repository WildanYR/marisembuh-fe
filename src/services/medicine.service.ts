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
    let uri = "/medicine";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IMedicineResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
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
  }
};

export const getMedicineByName = async (query: string) => {
  try {
    const response: AxiosResponse<IMedicineResponse[], any> = await axios.get(
      `/medicine?s=${query}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createMedicine = async (medicineDTO: IMedicineCreate) => {
  try {
    await axios.post("/medicine", medicineDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateMedicine = async (
  medicineId: number,
  medicineDTO: IMedicineUpdate
) => {
  try {
    await axios.put(`/medicine/${medicineId}`, medicineDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteMedicine = async (medicineId: number) => {
  try {
    await axios.delete(`/medicine/${medicineId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
