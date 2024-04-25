import { RouteRecordRaw } from "vue-router";
import TreatmentAnalyticList from "../pages/analytic/treatment/TreatmentAnalyticList.vue";
import TAPatientList from "../pages/analytic/treatment/TAPatientList.vue";
import TAUserList from "../pages/analytic/treatment/TAUserList.vue";
import TAClinicList from "../pages/analytic/treatment/TAClinicList.vue";
import TATreatmentList from "../pages/analytic/treatment/TATreatmentList.vue";
import TreatmentForm from "../pages/treatment/TreatmentForm.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "TreatmentAnalyticList",
    path: "",
    component: TreatmentAnalyticList,
  },
  {
    name: "TreatmentAnalyticListUser",
    path: "me",
    component: TATreatmentList,
  },
  {
    name: "TATreatmentDetail",
    path: "detail/:id",
    component: TreatmentForm,
    meta: {
      title: "Detail Perawatan (Analisis)",
      readOnly: true,
    },
  },
  // Patient
  {
    name: "TAPatientList",
    path: "pasien",
    component: TAPatientList,
  },
  {
    name: "TAPatientTreatmentList",
    path: "pasien/:patientId",
    component: TATreatmentList,
  },
  // User
  {
    name: "TAUserList",
    path: "user",
    component: TAUserList,
  },
  {
    name: "TAUserTreatmentList",
    path: "user/:userId",
    component: TATreatmentList,
  },
  // Klinik
  {
    name: "TAClinicList",
    path: "klinik",
    component: TAClinicList,
  },
  {
    name: "TAClinicTreatmentList",
    path: "klinik/:clinicId",
    component: TATreatmentList,
  },
];

export default routes;
