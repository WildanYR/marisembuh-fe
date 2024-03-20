import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IDoctorDiagnosisResponse {
  id: number;
  name: string;
}

interface IDoctorDiagnosisCreate {
  name: string;
}

interface IDoctorDiagnosisUpdate extends Partial<IDoctorDiagnosisCreate> {}

export const getAllDoctorDiagnosisWithPagination = async (
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
      IPaginationResponse<IDoctorDiagnosisResponse>,
      any
    > = await axios.get("/doctor-diagnosis", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getDoctorDiagnosisById = async (doctordiagnosisId: number) => {
  try {
    const response: AxiosResponse<IDoctorDiagnosisResponse, any> =
      await axios.get(`/doctor-diagnosis/${doctordiagnosisId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getDoctorDiagnosisByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IDoctorDiagnosisResponse[], any> =
      await axios.get("/doctor-diagnosis", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createDoctorDiagnosis = async (
  doctordiagnosisDTO: IDoctorDiagnosisCreate
) => {
  try {
    const response = await axios.post("/doctor-diagnosis", doctordiagnosisDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateDoctorDiagnosis = async (
  doctordiagnosisId: number,
  doctordiagnosisDTO: IDoctorDiagnosisUpdate
) => {
  try {
    const response = await axios.put(
      `/doctor-diagnosis/${doctordiagnosisId}`,
      doctordiagnosisDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteDoctorDiagnosis = async (doctordiagnosisId: number) => {
  try {
    await axios.delete(`/doctor-diagnosis/${doctordiagnosisId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
