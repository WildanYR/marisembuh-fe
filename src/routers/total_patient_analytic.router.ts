import { RouteRecordRaw } from "vue-router";
import TotalPatientAnalyticList from "../pages/analytic/TotalPatientAnalyticList.vue";
import TotalPatientAnalyticTherapy from "../pages/analytic/TotalPatientAnalyticTherapy.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "TotalPatientAnalytic",
    path: "",
    component: TotalPatientAnalyticList,
  },
  {
    name: "TotalPatientAnalyticTherapy",
    path: "jenis-terapi",
    component: TotalPatientAnalyticTherapy,
  },
];

export default routes;
