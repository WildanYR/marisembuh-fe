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
    const queryData = [];
    if (pagination) {
      queryData.push(
        ...Object.entries(pagination).map((q) => `${q[0]}=${q[1]}`)
      );
    }
    if (dateFilter) {
      queryData.push(`start_date=${dateFilter.startDate.toISOString()}`);
      queryData.push(`end_date=${dateFilter.endDate.toISOString()}`);
    }
    if (clinicId) {
      queryData.push(`clinic_id=${clinicId}`);
    }
    let url = "analytic/absence";
    if (queryData.length) {
      const queryJoin = queryData.join("&");
      url += "?" + queryJoin;
    }
    const response: AxiosResponse<
      IPaginationResponse<IAbsenceAnalyticResponse>,
      any
    > = await axios.get(url);
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
    const queryData = [`s=${name}`];
    if (dateFilter) {
      queryData.push(`start_date=${dateFilter.startDate.toISOString()}`);
      queryData.push(`end_date=${dateFilter.endDate.toISOString()}`);
    }

    let url = "analytic/absence";
    if (queryData.length) {
      const queryJoin = queryData.join("&");
      url += "?" + queryJoin;
    }
    const response: AxiosResponse<IAbsenceAnalyticResponse[], any> =
      await axios.get(url);
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
    const queryData = [];
    if (pagination) {
      queryData.push(
        ...Object.entries(pagination).map((q) => `${q[0]}=${q[1]}`)
      );
    }
    if (dateFilter) {
      queryData.push(`start_date=${dateFilter.startDate.toISOString()}`);
      queryData.push(`end_date=${dateFilter.endDate.toISOString()}`);
    }

    let url = `analytic/absence/user/${userId}`;
    if (queryData.length) {
      const queryJoin = queryData.join("&");
      url += "?" + queryJoin;
    }
    const response: AxiosResponse<IAbsenceAnalyticDetailResponse, any> =
      await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
