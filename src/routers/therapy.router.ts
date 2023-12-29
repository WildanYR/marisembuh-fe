import { RouteRecordRaw } from "vue-router";
import TherapyList from "../pages/therapy/TherapyList.vue";
import TherapyForm from "../pages/therapy/TherapyForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "TherapyList", path: "", component: TherapyList },
  {
    name: "TherapyAdd",
    path: "tambah",
    component: TherapyForm,
    meta: { title: "Tambah Terapi (tindakan)" },
  },
  {
    name: "TherapyEdit",
    path: "edit/:id",
    component: TherapyForm,
    meta: { title: "Edit Terapi (tindakan)" },
  },
];

export default routes;
