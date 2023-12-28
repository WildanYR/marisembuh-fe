import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import PatientRoutes from "./patient.router";
import GrayBgLayout from "../layouts/GrayBgLayout.vue";
import ClinicRoutes from "./clinic.router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "Home", path: "/", component: Home },
    { name: "Login", path: "/login", component: Login },
    {
      name: "PatientLayout",
      path: "/pasien",
      component: GrayBgLayout,
      children: PatientRoutes,
    },
    {
      name: "ClinicLayout",
      path: "/klinik",
      component: GrayBgLayout,
      children: ClinicRoutes,
    },
  ],
});

export default router;
