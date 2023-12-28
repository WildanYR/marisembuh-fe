import axios, { AxiosResponse } from "axios";
import { IPagination, IPaginationResponse } from "../types/pagination.type";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface ITreatmentPacketResponse {
  id: number;
  name: string;
}

interface ITreatmentPacketCreate {
  name: string;
}

interface ITreatmentPacketUpdate extends Partial<ITreatmentPacketCreate> {}

export const getAllTreatmentPacketWithPagination = async (
  pagination?: IPagination
) => {
  try {
    let uri = "/treatment-packet";
    if (pagination) {
      const query = Object.entries(pagination)
        .map((q) => `${q[0]}=${q[1]}`)
        .join("&");
      uri += `?${query}`;
    }
    const response: AxiosResponse<
      IPaginationResponse<ITreatmentPacketResponse>,
      any
    > = await axios.get(uri);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getTreatmentPacketById = async (treatmentpacketId: number) => {
  try {
    const response: AxiosResponse<ITreatmentPacketResponse, any> =
      await axios.get(`/treatment-packet/${treatmentpacketId}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const getTreatmentPacketByName = async (query: string) => {
  try {
    const response: AxiosResponse<ITreatmentPacketResponse[], any> =
      await axios.get(`/treatment-packet?s=${query}`);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const createTreatmentPacket = async (
  treatmentpacketDTO: ITreatmentPacketCreate
) => {
  try {
    await axios.post("/treatment-packet", treatmentpacketDTO);
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const updateTreatmentPacket = async (
  treatmentpacketId: number,
  treatmentpacketDTO: ITreatmentPacketUpdate
) => {
  try {
    await axios.put(
      `/treatment-packet/${treatmentpacketId}`,
      treatmentpacketDTO
    );
  } catch (error) {
    requestErrorHandler(error);
  }
};

export const deleteTreatmentPacket = async (treatmentpacketId: number) => {
  try {
    await axios.delete(`/treatment-packet/${treatmentpacketId}`);
  } catch (error) {
    requestErrorHandler(error);
  }
};
