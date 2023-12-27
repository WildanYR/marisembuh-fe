import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import * as axiosConfig from "./configs/axios.config";
import Notifications from "@kyvg/vue3-notification";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

axiosConfig.init();

createApp(App)
  .use(pinia)
  .use(Notifications)
  .use(router)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app");
