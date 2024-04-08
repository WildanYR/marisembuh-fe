import { RouteRecordRaw } from "vue-router";
import AbsenceAnalytic from "../pages/analytic/AbsenceAnalytic.vue";
import AbsenceAnalyticDetail from "../pages/analytic/AbsenceAnalyticDetail.vue";

const routes: RouteRecordRaw[] = [
  { name: "AbsenceAnalytic", path: "", component: AbsenceAnalytic },
  {
    name: "AbsenceAnalyticDetail",
    path: "user/:userId",
    component: AbsenceAnalyticDetail,
  },
  {
    name: "AbsenceAnalyticDetailUser",
    path: "user",
    component: AbsenceAnalyticDetail,
  },
];

export default routes;
