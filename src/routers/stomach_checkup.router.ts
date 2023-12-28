import { RouteRecordRaw } from "vue-router";
import StomachCheckupList from "../pages/stomach_checkup/StomachCheckupList.vue";
import StomachCheckupForm from "../pages/stomach_checkup/StomachCheckupForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "StomachCheckupList", path: "", component: StomachCheckupList },
  {
    name: "StomachCheckupAdd",
    path: "tambah",
    component: StomachCheckupForm,
    meta: { title: "Tambah Pemeriksaan Perut" },
  },
  {
    name: "StomachCheckupEdit",
    path: "edit/:id",
    component: StomachCheckupForm,
    meta: { title: "Edit Pemeriksaan Perut" },
  },
];

export default routes;
