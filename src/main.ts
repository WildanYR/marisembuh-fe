import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import * as axiosConfig from "./configs/axios.config";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

axiosConfig.init();

createApp(App).use(pinia).use(router).mount("#app");
