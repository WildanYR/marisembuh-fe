import axios, { AxiosResponse } from "axios";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IPagination, IPaginationResponse } from "../types/pagination.type";

interface IPatientCreate {
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  telp: string;
  user_id: number;
  clinic_id: number;
}

interface IPatientUpdate extends Partial<IPatientCreate> {}

export interface IPatientResponse {
  id: number;
  no_rm: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  telp: string;
  created_at: string;
  registered_by: {
    id: number;
    name: string;
    role: string;
  };
  register_clinic: {
    id: number;
    name: string;
  };
}

export const getAllPatientWithPagination = async (pagination?: IPagination) => {
  try {
    let uri = "/patient";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IPatientResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getPatientById = async (patientId: number) => {
  try {
    const response: AxiosResponse<IPatientResponse, any> = await axios.get(
      `/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getPatientByName = async (query: string) => {
  try {
    const response: AxiosResponse<IPatientResponse[], any> = await axios.get(
      `/patient?s=${query}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createPatient = async (patientDTO: IPatientCreate) => {
  try {
    await axios.post("/patient", patientDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updatePatient = async (
  patientId: number,
  patientDTO: IPatientUpdate
) => {
  try {
    await axios.put(`/patient/${patientId}`, patientDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deletePatient = async (patientId: number) => {
  try {
    await axios.delete(`/patient/${patientId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
