import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import PatientRoutes from "./patient.router";
import GrayBgLayout from "../layouts/GrayBgLayout.vue";
import ClinicRoutes from "./clinic.router";
import MedicineRoutes from "./medicine.router";
import DoctorDiagnosisRoutes from "./doctor_diagnosis.router";
import SelfTherapyRoutes from "./self_therapy.router";
import TreatmentPacketRoutes from "./treatment_packet.router";

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
    {
      name: "MedicineLayout",
      path: "/obat",
      component: GrayBgLayout,
      children: MedicineRoutes,
    },
    {
      name: "DoctorDiagnosisLayout",
      path: "/diagnosa-dokter",
      component: GrayBgLayout,
      children: DoctorDiagnosisRoutes,
    },
    {
      name: "SelfTherapyLayout",
      path: "/terapi-mandiri",
      component: GrayBgLayout,
      children: SelfTherapyRoutes,
    },
    {
      name: "TreatmentPacketLayout",
      path: "/paket-perawatan",
      component: GrayBgLayout,
      children: TreatmentPacketRoutes,
    },
  ],
});

export default router;
