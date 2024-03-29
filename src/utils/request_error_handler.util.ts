import { AxiosError, HttpStatusCode, isAxiosError } from "axios";
import { notify } from "@kyvg/vue3-notification";
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
      notify({
        type: "error",
        title: "Error",
        text: error.response.data.message,
      });
      return;
    }
    if (error.request) {
      if (!navigator.onLine) {
        notify({
          type: "error",
          title: "Koneksi Error",
          text: "Request tidak terkirim. silahkan cek koneksi internet",
        });
        return;
      }
      notify({
        type: "error",
        title: "Server Error",
        text: "Server error, silahkan hubungi admin",
      });
      return;
    }
  }
  console.error("Error", error.message);
  notify({
    type: "error",
    title: "Error",
    text: error.message,
  });
};
