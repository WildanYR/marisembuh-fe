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
    let uri = "/self-therapy";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<ISelfTherapyResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
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
  }
};

export const getSelfTherapyByName = async (query: string) => {
  try {
    const response: AxiosResponse<ISelfTherapyResponse[], any> =
      await axios.get(`/self-therapy?s=${query}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createSelfTherapy = async (selftherapyDTO: ISelfTherapyCreate) => {
  try {
    await axios.post("/self-therapy", selftherapyDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateSelfTherapy = async (
  selftherapyId: number,
  selftherapyDTO: ISelfTherapyUpdate
) => {
  try {
    await axios.put(`/self-therapy/${selftherapyId}`, selftherapyDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteSelfTherapy = async (selftherapyId: number) => {
  try {
    await axios.delete(`/self-therapy/${selftherapyId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
