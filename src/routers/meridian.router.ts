import { RouteRecordRaw } from "vue-router";
import MeridianList from "../pages/meridian/MeridianList.vue";
import MeridianForm from "../pages/meridian/MeridianForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "MeridianList", path: "", component: MeridianList },
  {
    name: "MeridianAdd",
    path: "tambah",
    component: MeridianForm,
    meta: { title: "Tambah Meridian" },
  },
  {
    name: "MeridianEdit",
    path: "edit/:id",
    component: MeridianForm,
    meta: { title: "Edit Meridian" },
  },
];

export default routes;
