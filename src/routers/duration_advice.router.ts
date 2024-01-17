import { RouteRecordRaw } from "vue-router";
import DurationAdviceList from "../pages/duration_advice/DurationAdviceList.vue";
import DurationAdviceForm from "../pages/duration_advice/DurationAdviceForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "DurationAdviceList", path: "", component: DurationAdviceList },
  {
    name: "DurationAdviceAdd",
    path: "tambah",
    component: DurationAdviceForm,
    meta: { title: "Tambah Saran Perawatan" },
  },
  {
    name: "DurationAdviceEdit",
    path: "edit/:id",
    component: DurationAdviceForm,
    meta: { title: "Edit Saran Perawatan" },
  },
];

export default routes;
