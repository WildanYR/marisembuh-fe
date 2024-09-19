import { RouteRecordRaw } from "vue-router";
import PatientAnalytic from "../pages/analytic/patient/PatientAnalytic.vue";

const routes: RouteRecordRaw[] = [
  { name: "PatientAnalytic", path: "", component: PatientAnalytic },
];

export default routes;
