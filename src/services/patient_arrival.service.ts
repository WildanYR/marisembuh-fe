import axios, { AxiosResponse } from "axios";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IPagination, IPaginationResponse } from "../types/pagination.type";

interface IPatientIncluded {
  id: number;
  no_rm: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  telp: string;
  register_clinic: IPatientClinicIncluded;
}

interface IPatientClinicIncluded {
  id: number;
  name: string;
}

interface IUserIncluded {
  id: number;
  name: string;
}

export interface IPatientArrivalResponse {
  id: number;
  done: boolean;
  type: string;
  patient: IPatientIncluded;
  user: IUserIncluded;
  tag_user: IUserIncluded;
  created_at: string;
}

export interface IPatientArrivalCreate {
  patient_id: number;
  user_id: number;
  tag_user_id: number;
  type: string;
}

export interface IPatientArrivalUpdate {
  patient_id?: number;
  user_id?: number;
  type?: string;
}

export interface IQueryFilterPatientArrival {
  done?: boolean;
  patient_id?: number;
  user_id?: number;
  tag_user_id?: number;
  type?: string;
}

export const getAllPatientArrivalWithPagination = async (
  pagination?: IPagination,
  queryFilter?: IQueryFilterPatientArrival
) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    if (queryFilter) {
      Object.entries(queryFilter).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IPatientArrivalResponse>,
      any
    > = await axios.get("/patient-arrival", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getPatientArrivalById = async (patientArrivalId: number) => {
  try {
    const response: AxiosResponse<IPatientArrivalResponse, any> =
      await axios.get(`/patient-arrival/${patientArrivalId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createPatientArrival = async (
  patientArrivalDTO: IPatientArrivalCreate
) => {
  try {
    const response = await axios.post("/patient-arrival", patientArrivalDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updatePatientArrival = async (
  patientArrivalId: number,
  patientArrivalDTO: IPatientArrivalUpdate
) => {
  try {
    const response = await axios.put(
      `/patient-arrival/${patientArrivalId}`,
      patientArrivalDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deletePatientArrival = async (patientArrivalId: number) => {
  try {
    await axios.delete(`/patient-arrival/${patientArrivalId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
