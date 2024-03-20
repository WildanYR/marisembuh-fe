import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IDurationAdviceResponse {
  id: number;
  name: string;
}

interface IDurationAdviceCreate {
  name: string;
}

interface IDurationAdviceUpdate extends Partial<IDurationAdviceCreate> {}

export const getAllDurationAdviceWithPagination = async (
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
      IPaginationResponse<IDurationAdviceResponse>,
      any
    > = await axios.get("/duration-advice", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getDurationAdviceById = async (durationadviceId: number) => {
  try {
    const response: AxiosResponse<IDurationAdviceResponse, any> =
      await axios.get(`/duration-advice/${durationadviceId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getDurationAdviceByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<IDurationAdviceResponse[], any> =
      await axios.get("/duration-advice", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createDurationAdvice = async (
  durationadviceDTO: IDurationAdviceCreate
) => {
  try {
    const response = await axios.post("/duration-advice", durationadviceDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateDurationAdvice = async (
  durationadviceId: number,
  durationadviceDTO: IDurationAdviceUpdate
) => {
  try {
    const response = await axios.put(
      `/duration-advice/${durationadviceId}`,
      durationadviceDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteDurationAdvice = async (durationadviceId: number) => {
  try {
    await axios.delete(`/duration-advice/${durationadviceId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
