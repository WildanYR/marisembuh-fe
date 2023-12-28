import { RouteRecordRaw } from "vue-router";
import SelfTherapyList from "../pages/self_therapy/SelfTherapyList.vue";
import SelfTherapyForm from "../pages/self_therapy/SelfTherapyForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "SelfTherapyList", path: "", component: SelfTherapyList },
  {
    name: "SelfTherapyAdd",
    path: "tambah",
    component: SelfTherapyForm,
    meta: { title: "Tambah Terapi Mandiri" },
  },
  {
    name: "SelfTherapyEdit",
    path: "edit/:id",
    component: SelfTherapyForm,
    meta: { title: "Edit Terapi Mandiri" },
  },
];

export default routes;
