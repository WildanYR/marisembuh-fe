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

interface IPatientCountCondition {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  patient_id?: number;
  clinic_id?: number;
}

export const getAllPatientWithPagination = async (pagination?: IPagination) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response: AxiosResponse<
      IPaginationResponse<IPatientResponse>,
      any
    > = await axios.get("/patient", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
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
    throw error;
  }
};

export const getPatientByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IPatientResponse[], any> = await axios.get(
      "/patient",
      { params }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createPatient = async (patientDTO: IPatientCreate) => {
  try {
    const response = await axios.post("/patient", patientDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updatePatient = async (
  patientId: number,
  patientDTO: IPatientUpdate
) => {
  try {
    const response = await axios.put(`/patient/${patientId}`, patientDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deletePatient = async (patientId: number) => {
  try {
    await axios.delete(`/patient/${patientId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getPatientCount = async (
  patientCondition: IPatientCountCondition
): Promise<number> => {
  try {
    const params = new URLSearchParams();
    if (patientCondition) {
      Object.entries(patientCondition).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }

    const response = await axios.get("/patient/count", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
