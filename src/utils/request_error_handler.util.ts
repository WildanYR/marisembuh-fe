import { AxiosError, HttpStatusCode, isAxiosError } from "axios";
import { tokenKey } from "../configs";
import router from "../routers";

export const requestErrorHandler = (error: AxiosError | any) => {
  if (isAxiosError(error)) {
    if (error.response) {
      console.error(error.response.data);
      if (error.response.status === HttpStatusCode.Unauthorized) {
        localStorage.removeItem(tokenKey);
        router.push({ name: "Login" });
      }
      // notify
      return;
    }
    if (error.request) {
      console.error("Request tidak terkirim");
      // notify
      return;
    }
  }
  console.error("Error", error.message);
  // notify
};
