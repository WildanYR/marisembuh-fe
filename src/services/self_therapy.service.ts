import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface ISelfTherapyResponse {
  id: number;
  name: string;
}

interface ISelfTherapyCreate {
  name: string;
}

interface ISelfTherapyUpdate extends Partial<ISelfTherapyCreate> {}

export const getAllSelfTherapyWithPagination = async (
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
      IPaginationResponse<ISelfTherapyResponse>,
      any
    > = await axios.get("/self-therapy", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getSelfTherapyById = async (selftherapyId: number) => {
  try {
    const response: AxiosResponse<ISelfTherapyResponse, any> = await axios.get(
      `/self-therapy/${selftherapyId}`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getSelfTherapyByName = async (query: string) => {
  try {
    const params = new URLSearchParams();
    params.append("s", query);

    const response: AxiosResponse<ISelfTherapyResponse[], any> =
      await axios.get("/self-therapy", { params });
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const createSelfTherapy = async (selftherapyDTO: ISelfTherapyCreate) => {
  try {
    const response = await axios.post("/self-therapy", selftherapyDTO);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const updateSelfTherapy = async (
  selftherapyId: number,
  selftherapyDTO: ISelfTherapyUpdate
) => {
  try {
    const response = await axios.put(
      `/self-therapy/${selftherapyId}`,
      selftherapyDTO
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const deleteSelfTherapy = async (selftherapyId: number) => {
  try {
    await axios.delete(`/self-therapy/${selftherapyId}`);
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
