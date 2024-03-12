import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IDateFilterQuery } from "../types/date_filter.type";

export interface ITotalPatientAnalyticResponse {
  id: number;
  name: string;
  total_patient: number;
}

export const getTotalPatientAnalyticTherapyPagination = async (
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
    let url = "analytic/total-patient/therapy";
    if (queryData.length) {
      const queryJoin = queryData.join("&");
      url += "?" + queryJoin;
    }
    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticTherapyByName = async (
  name: string,
  dateFilter?: IDateFilterQuery
) => {
  try {
    const queryData = [`s=${name}`];
    if (dateFilter) {
      queryData.push(`start_date=${dateFilter.startDate.toISOString()}`);
      queryData.push(`end_date=${dateFilter.endDate.toISOString()}`);
    }

    let url = "analytic/total-patient/therapy";
    if (queryData.length) {
      const queryJoin = queryData.join("&");
      url += "?" + queryJoin;
    }
    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
