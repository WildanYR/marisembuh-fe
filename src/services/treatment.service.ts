import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

interface ITreatmentData {
  id: number;
  name: string;
}

interface ITreatmentPatient {
  id: number;
  no_rm: string;
  name: string;
  gender: string;
  address: string;
}

interface ITreatmentTherapy {
  id: number;
  name: string;
  TreatmentTherapy: {
    detail: string;
  };
}

interface IPulseCheckup {
  depth: string;
  speed: string;
  power: string;
  abnormal_type: string;
  location_differentiation: string;
}

export interface ITreatmentResponse {
  id: number;
  created_at: string;
  objective: string;
  blood_pressure?: string;
  pulse_frequency?: string;
  is_pregnant: boolean;
  patient_id: number;
  patient: ITreatmentPatient;
  duration_advice_id?: number;
  duration_advice?: ITreatmentData;
  treatment_packet_id?: number;
  treatment_packet?: ITreatmentData;
  evaluation?: string;
  doctor_diagnosis?: ITreatmentData[];
  medicine?: ITreatmentData[];
  therapy_history?: ITreatmentData[];
  complaint?: ITreatmentData[];
  stomach_checkup?: ITreatmentData[];
  pulse_checkup?: IPulseCheckup;
  tongue_checkup?: ITreatmentData[];
  self_therapy?: ITreatmentData[];
  therapy: ITreatmentTherapy[];
  user_id: number;
  clinic_id: number;
  user: ITreatmentData;
  clinic: ITreatmentData;
}

export interface IGetTreatmentQuery {
  patient_id?: number | string;
  user_id?: number | string;
  clinic_id?: number | string;
  with_relation?: boolean;
}

export const getAllTreatmentWithPagination = async (
  query: IGetTreatmentQuery,
  pagination?: IPagination
) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }
    if (query.with_relation) {
      params.append("with_relation", query.with_relation ? "true" : "false");
    }
    if (query.patient_id) {
      let val: string = "";
      if (typeof query.patient_id === "number")
        val = query.patient_id.toString();
      else val = query.patient_id;
      params.append("patient_id", val);
    }
    if (query.user_id) {
      let val: string = "";
      if (typeof query.user_id === "number") val = query.user_id.toString();
      else val = query.user_id;
      params.append("user_id", val);
    }
    if (query.clinic_id) {
      let val: string = "";
      if (typeof query.clinic_id === "number") val = query.clinic_id.toString();
      else val = query.clinic_id;
      params.append("clinic_id", val);
    }

    const response: AxiosResponse<
      IPaginationResponse<ITreatmentResponse>,
      any
    > = await axios.get(`/treatment`, { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTreatmentById = async (treatmentId: number) => {
  try {
    const response: AxiosResponse<ITreatmentResponse, any> = await axios.get(
      `/treatment/${treatmentId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createTreatment = async (treatmentDTO: any) => {
  try {
    return await axios.post("/treatment", treatmentDTO);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateTreatment = async (
  treatmentId: number,
  treatmentDTO: any
) => {
  try {
    await axios.put(`/treatment/${treatmentId}`, treatmentDTO);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteTreatment = async (treatmentId: number) => {
  try {
    await axios.delete(`/treatment/${treatmentId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
