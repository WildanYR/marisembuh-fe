import { RouteRecordRaw } from "vue-router";
import TotalPatientAnalyticList from "../pages/analytic/TotalPatientAnalyticList.vue";
import TotalPatientAnalyticTherapy from "../pages/analytic/TotalPatientAnalyticTherapy.vue";
import TotalPatientAnalyticClinic from "../pages/analytic/TotalPatientAnalyticClinic.vue";
import TotalPatientAnalyticUser from "../pages/analytic/TotalPatientAnalyticUser.vue";

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
];

export default routes;
