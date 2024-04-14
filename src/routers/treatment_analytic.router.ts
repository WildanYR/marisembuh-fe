import { RouteRecordRaw } from "vue-router";
import TreatmentAnalyticList from "../pages/analytic/treatment/TreatmentAnalyticList.vue";
import TAPatientList from "../pages/analytic/treatment/TAPatientList.vue";
import TAUserList from "../pages/analytic/treatment/TAUserList.vue";
import TAClinicList from "../pages/analytic/treatment/TAClinicList.vue";
import TATreatmentList from "../pages/analytic/treatment/TATreatmentList.vue";
import TreatmentForm from "../pages/treatment/TreatmentForm.vue";
import TATreatmentListUser from "../pages/analytic/treatment/TATreatmentListUser.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "TreatmentAnalyticList",
    path: "",
    component: TreatmentAnalyticList,
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
  {
    name: "TAPatientTreatmentDetail",
    path: "pasien/:patientId/perawatan/:id",
    component: TreatmentForm,
    meta: {
      title: "Detail Perawatan (Analisis)",
      readOnly: true,
      previousPage: "TAPatientTreatmentList",
      pageParams: ["patientId"],
    },
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
  {
    name: "TAUserTreatmentDetail",
    path: "user/:userId/perawatan/:id",
    component: TreatmentForm,
    meta: {
      title: "Detail Perawatan (Analisis)",
      readOnly: true,
      previousPage: "TAUserTreatmentList",
      pageParams: ["userId"],
    },
  },
  {
    name: "TAUserTreatmentListUser",
    path: "user",
    component: TATreatmentListUser,
  },
  {
    name: "TAUserTreatmentDetailUser",
    path: "user/perawatan/:id",
    component: TreatmentForm,
    meta: {
      title: "Detail Perawatan (Analisis)",
      readOnly: true,
      previousPage: "TAUserTreatmentListUser",
    },
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
  {
    name: "TAClinicTreatmentDetail",
    path: "klinik/:clinicId/perawatan/:id",
    component: TreatmentForm,
    meta: {
      title: "Detail Perawatan (Analisis)",
      readOnly: true,
      previousPage: "TAClinicTreatmentList",
      pageParams: ["clinicId"],
    },
  },
];

export default routes;
