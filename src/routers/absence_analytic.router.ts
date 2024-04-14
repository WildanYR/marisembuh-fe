import { RouteRecordRaw } from "vue-router";
import AbsenceAnalytic from "../pages/analytic/absence/AbsenceAnalytic.vue";
import AbsenceAnalyticDetail from "../pages/analytic/absence/AbsenceAnalyticDetail.vue";
import AbsenceAnalyticDetailUser from "../pages/analytic/absence/AbsenceAnalyticDetailUser.vue";

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
    component: AbsenceAnalyticDetailUser,
  },
];

export default routes;
