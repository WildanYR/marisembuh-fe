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
import StomachCheckupRoutes from "./stomach_checkup.router";
import TongueCheckupRoutes from "./tongue_checkup.router";
import TherapyRoutes from "./therapy.router";
import MeridianRoutes from "./meridian.router";
import ComplaintRoutes from "./complaint.router";
import UserRoutes from "./user.router";
import DurationAdviceRoutes from "./duration_advice.router";
import TreatmentRoutes from "./treatment.router";
import AbsenceRoutes from "./absence.router";
import AbsenceAnalyticRoutes from "./absence_analytic.router";
import TotalPatientAnalyticRoutes from "./total_patient_analytic.router";
import TreatmentAnalyticRoutes from "./treatment_analytic.router";
import PatientArrivalRoutes from "./patient_arrival.router";
import PatientAnalyticRoutes from "./patient_analytic.router";
import { tokenKey } from "../configs";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "Home", path: "/", component: Home },
    {
      name: "Login",
      path: "/login",
      component: Login,
      meta: { publicRoute: true },
    },
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
    {
      name: "StomachCheckupLayout",
      path: "/pemeriksaan-perut",
      component: GrayBgLayout,
      children: StomachCheckupRoutes,
    },
    {
      name: "TongueCheckupLayout",
      path: "/pemeriksaan-lidah",
      component: GrayBgLayout,
      children: TongueCheckupRoutes,
    },
    {
      name: "TherapyLayout",
      path: "/terapi",
      component: GrayBgLayout,
      children: TherapyRoutes,
    },
    {
      name: "MeridianLayout",
      path: "/meridian",
      component: GrayBgLayout,
      children: MeridianRoutes,
    },
    {
      name: "ComplaintLayout",
      path: "/complaint",
      component: GrayBgLayout,
      children: ComplaintRoutes,
    },
    {
      name: "UserLayout",
      path: "/user",
      component: GrayBgLayout,
      children: UserRoutes,
    },
    {
      name: "DurationAdviceLayout",
      path: "/saran-perawatan",
      component: GrayBgLayout,
      children: DurationAdviceRoutes,
    },
    {
      name: "TreatmentLayout",
      path: "/treatment",
      component: GrayBgLayout,
      children: TreatmentRoutes,
    },
    {
      name: "AbsenceLayout",
      path: "/absen",
      component: GrayBgLayout,
      children: AbsenceRoutes,
    },
    {
      name: "AbsenceAnalyticLayout",
      path: "/analisis/absen",
      component: GrayBgLayout,
      children: AbsenceAnalyticRoutes,
    },
    {
      name: "TotalPatientAnalyticLayout",
      path: "/analisis/jumlah-pasien",
      component: GrayBgLayout,
      children: TotalPatientAnalyticRoutes,
    },
    {
      name: "TreatmentAnalyticLayout",
      path: "/analisis/perawatan",
      component: GrayBgLayout,
      children: TreatmentAnalyticRoutes,
    },
    {
      name: "PatientArrivalLayout",
      path: "/kedatangan-pasien",
      component: GrayBgLayout,
      children: PatientArrivalRoutes,
    },
    {
      name: "PatientAnalyticLayout",
      path: "/analisis/pasien",
      component: GrayBgLayout,
      children: PatientAnalyticRoutes,
    },
  ],
});

router.beforeEach((to) => {
  if (!to.meta.publicRoute) {
    const token = localStorage.getItem(tokenKey);
    if (!token) return { name: "Login" };
  }
  return true;
});

export default router;
