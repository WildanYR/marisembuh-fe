import axios, { AxiosResponse } from "axios";
import { requestErrorHandler } from "../utils/request_error_handler.util";
import { AbsenceStatus } from "../pages/absence/types/absence_status.type";
import { DateTime } from "luxon";

interface IAbsenceResponse {
  status: AbsenceStatus;
  absence_code?: string;
}

export const checkAbsence = async (userId: number) => {
  try {
    const response: AxiosResponse<IAbsenceResponse, any> = await axios.get(
      `/absence/${userId}/check`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const handleAbsence = async (
  userId: number,
  type: string,
  data?: string
) => {
  try {
    const response: AxiosResponse<IAbsenceResponse, any> = await axios.post(
      `/absence/${userId}`,
      { type, data, client_date: DateTime.now().toISO() }
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const finishAbsence = async (userId: number) => {
  try {
    const response: AxiosResponse<IAbsenceResponse, any> = await axios.put(
      `/absence/${userId}/finish`
    );
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
