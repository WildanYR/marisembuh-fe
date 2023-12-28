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
    let uri = "/doctor-diagnosis";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<IDoctorDiagnosisResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getDoctorDiagnosisById = async (doctordiagnosisId: number) => {
  try {
    const response: AxiosResponse<IDoctorDiagnosisResponse, any> =
      await axios.get(`/doctor-diagnosis/${doctordiagnosisId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getDoctorDiagnosisByName = async (query: string) => {
  try {
    const response: AxiosResponse<IDoctorDiagnosisResponse[], any> =
      await axios.get(`/doctor-diagnosis?s=${query}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createDoctorDiagnosis = async (
  doctordiagnosisDTO: IDoctorDiagnosisCreate
) => {
  try {
    await axios.post("/doctor-diagnosis", doctordiagnosisDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateDoctorDiagnosis = async (
  doctordiagnosisId: number,
  doctordiagnosisDTO: IDoctorDiagnosisUpdate
) => {
  try {
    await axios.put(
      `/doctor-diagnosis/${doctordiagnosisId}`,
      doctordiagnosisDTO
    );
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteDoctorDiagnosis = async (doctordiagnosisId: number) => {
  try {
    await axios.delete(`/doctor-diagnosis/${doctordiagnosisId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
