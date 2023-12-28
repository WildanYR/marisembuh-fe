import { RouteRecordRaw } from "vue-router";
import TongueCheckupList from "../pages/tongue_checkup/TongueCheckupList.vue";
import TongueCheckupForm from "../pages/tongue_checkup/TongueCheckupForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "TongueCheckupList", path: "", component: TongueCheckupList },
  {
    name: "TongueCheckupAdd",
    path: "tambah",
    component: TongueCheckupForm,
    meta: { title: "Tambah Pemeriksaan Lidah" },
  },
  {
    name: "TongueCheckupEdit",
    path: "edit/:id",
    component: TongueCheckupForm,
    meta: { title: "Edit Pemeriksaan Lidah" },
  },
];

export default routes;
