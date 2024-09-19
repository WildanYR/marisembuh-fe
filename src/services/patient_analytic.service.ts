import axios, { AxiosResponse } from "axios";
import { IDateFilterQuery } from "../types/date_filter.type";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IPatientAnalyticResponse {
  id: number;
  no_rm: string;
  name: string;
  patient_status: string;
  total_treatment: number;
  last_treatment_date: string;
}

export interface IPatientAnalyticSummary {
  new_patient: number;
  total_treatment: number;
}

export const getPatientAnalyticPagination = async (
  pagination?: IPagination,
  dateFilter?: IDateFilterQuery,
  sort?: string
) => {
  try {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach((q) => {
        params.append(q[0], q[1]);
      });
    }
    if (dateFilter?.startDate) {
      params.append("start_date", dateFilter.startDate);
    }
    if (dateFilter?.endDate) {
      params.append("end_date", dateFilter.endDate);
    }
    if (sort) {
      params.append("sort", sort);
    }

    const response: AxiosResponse<
      IPaginationResponse<IPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/patient", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getPatientAnalyticByName = async (
  name: string,
  dateFilter?: IDateFilterQuery
) => {
  try {
    const params = new URLSearchParams();
    params.append("s", name);
    if (dateFilter?.startDate) {
      params.append("start_date", dateFilter.startDate);
    }
    if (dateFilter?.endDate) {
      params.append("end_date", dateFilter.endDate);
    }

    const response: AxiosResponse<IPatientAnalyticResponse[], any> =
      await axios.get("analytic/patient", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getPatientAnalyticSummary = async (
  dateFilter?: IDateFilterQuery
) => {
  try {
    const params = new URLSearchParams();
    if (dateFilter?.startDate) {
      params.append("start_date", dateFilter.startDate);
    }
    if (dateFilter?.endDate) {
      params.append("end_date", dateFilter.endDate);
    }

    const response: AxiosResponse<IPatientAnalyticSummary, any> =
      await axios.get("analytic/patient/summary", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
