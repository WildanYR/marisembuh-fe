import axios from "axios";
import { requestErrorHandler } from "../utils/request_error_handler.util";

export interface IClinicAnalytic {
  id: number;
  name: string;
  today_patient: number;
  month_patient: number;
}

export interface IUserAnalytic {
  id: number;
  name: string;
  today_patient: number;
  month_patient: number;
}

export const getClinicAnalytic = async (date?: Date) => {
  try {
    let url = "/analytic/clinic";
    if (date) {
      url += `?date=${date.toISOString()}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};

export const getUserAnalytic = async (date?: Date) => {
  try {
    let url = "/analytic/clinic/user";
    if (date) {
      url += `?date=${date.toISOString()}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
    throw error;
  }
};
