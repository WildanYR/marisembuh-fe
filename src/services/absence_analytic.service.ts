import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IDateFilterQuery } from "../types/date_filter.type";

export interface IAbsenceAnalyticResponse {
  id: number;
  name: string;
  total: number;
  late: number;
  absent: number;
}

export interface IAbsenceDataResponse {
  id: number;
  type: string;
  in_clinic_time: string;
  afterwork_time: string;
  absence_code: string;
  user_id: number;
  created_at: string;
}

export interface IAbsenceAnalyticDetailResponse {
  lateHour: string;
  summary: IAbsenceAnalyticResponse;
  pagination: IPaginationResponse<IAbsenceDataResponse>;
}

export const getAbsenceAnalyticPagination = async (
  pagination?: IPagination,
  dateFilter?: IDateFilterQuery,
  clinicId?: number
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
    if (clinicId) {
      params.append("clinic_id", clinicId.toString());
    }
    const response: AxiosResponse<
      IPaginationResponse<IAbsenceAnalyticResponse>,
      any
    > = await axios.get("analytic/absence", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getAbsenceAnalyticByName = async (
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

    const response: AxiosResponse<IAbsenceAnalyticResponse[], any> =
      await axios.get("analytic/absence", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getAbsenceAnalyticDetail = async (
  userId: number,
  pagination?: IPagination,
  dateFilter?: IDateFilterQuery
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

    const response: AxiosResponse<IAbsenceAnalyticDetailResponse, any> =
      await axios.get(`analytic/absence/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
