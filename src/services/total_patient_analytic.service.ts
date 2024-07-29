import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { IDateFilterQuery } from "../types/date_filter.type";

export interface ITotalPatientAnalyticResponse {
  id: number;
  name: string;
  total_patient: number;
}

export const getTotalPatientAnalyticClinicPagination = async (
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

    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/total-patient/clinic", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticClinicByName = async (
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

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/clinic", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticUserPagination = async (
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

    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/total-patient/user", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticUserByName = async (
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

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/user", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticTherapyPagination = async (
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

    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/total-patient/therapy", { params });
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
    const params = new URLSearchParams();
    params.append("s", name);
    if (dateFilter?.startDate) {
      params.append("start_date", dateFilter.startDate);
    }
    if (dateFilter?.endDate) {
      params.append("end_date", dateFilter.endDate);
    }

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/therapy", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticHomecare = async (
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

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/homecare", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticComplaintPagination = async (
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

    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/total-patient/complaint", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticComplaintByName = async (
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

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/complaint", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticDoctorDiagnosisPagination = async (
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

    const response: AxiosResponse<
      IPaginationResponse<ITotalPatientAnalyticResponse>,
      any
    > = await axios.get("analytic/total-patient/doctor-diagnosis", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getTotalPatientAnalyticDoctorDiagnosisByName = async (
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

    const response: AxiosResponse<ITotalPatientAnalyticResponse[], any> =
      await axios.get("analytic/total-patient/doctor-diagnosis", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
