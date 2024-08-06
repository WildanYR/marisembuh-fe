import { RouteRecordRaw } from "vue-router";
import TotalPatientAnalyticList from "../pages/analytic/TotalPatientAnalyticList.vue";
import TotalPatientAnalyticTherapy from "../pages/analytic/TotalPatientAnalyticTherapy.vue";
import TotalPatientAnalyticClinic from "../pages/analytic/TotalPatientAnalyticClinic.vue";
import TotalPatientAnalyticUser from "../pages/analytic/TotalPatientAnalyticUser.vue";
import TotalPatientAnalyticHomecare from "../pages/analytic/TotalPatientAnalyticHomecare.vue";
import TotalPatientAnalyticComplaint from "../pages/analytic/TotalPatientAnalyticComplaint.vue";
import TotalPatientAnalyticDoctorDiagnosis from "../pages/analytic/TotalPatientAnalyticDoctorDiagnosis.vue";
import TotalPatientAnalyticTreatmentPacket from "../pages/analytic/TotalPatientAnalyticTreatmentPacket.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "TotalPatientAnalytic",
    path: "",
    component: TotalPatientAnalyticList,
  },
  {
    name: "TotalPatientAnalyticClinic",
    path: "klinik",
    component: TotalPatientAnalyticClinic,
  },
  {
    name: "TotalPatientAnalyticUser",
    path: "terapis",
    component: TotalPatientAnalyticUser,
  },
  {
    name: "TotalPatientAnalyticTherapy",
    path: "jenis-terapi",
    component: TotalPatientAnalyticTherapy,
  },
  {
    name: "TotalPatientAnalyticHomecare",
    path: "homecare",
    component: TotalPatientAnalyticHomecare,
  },
  {
    name: "TotalPatientAnalyticComplaint",
    path: "keluhan",
    component: TotalPatientAnalyticComplaint,
  },
  {
    name: "TotalPatientAnalyticDoctorDiagnosis",
    path: "diagnosa-dokter",
    component: TotalPatientAnalyticDoctorDiagnosis,
  },
  {
    name: "TotalPatientAnalyticTreatmentPacket",
    path: "paket-perawatan",
    component: TotalPatientAnalyticTreatmentPacket,
  },
];

export default routes;
