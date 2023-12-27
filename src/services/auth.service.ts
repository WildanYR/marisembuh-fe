import axios, { AxiosResponse } from "axios";
import { tokenKey } from "../configs";
import { requestErrorHandler } from "../utils/request_error_handler.util";

interface ILogin {
  email: string;
  password: string;
}

interface ILoginResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string;
}

export const login = async (
  loginDTO: ILogin
): Promise<ILoginResponse | undefined> => {
  try {
    const response: AxiosResponse<ILoginResponse, any> = await axios.post(
      "/auth/login",
      loginDTO
    );
    localStorage.setItem(tokenKey, response.data.token);
    return response.data;
  } catch (error) {
    requestErrorHandler(error);
  }
};
