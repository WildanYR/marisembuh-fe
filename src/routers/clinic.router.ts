import { RouteRecordRaw } from "vue-router";
import ClinicList from "../pages/clinic/ClinicList.vue";
import ClinicForm from "../pages/clinic/ClinicForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "ClinicList", path: "", component: ClinicList },
  {
    name: "ClinicAdd",
    path: "tambah",
    component: ClinicForm,
    meta: { title: "Tambah Klinik" },
  },
  {
    name: "ClinicEdit",
    path: "edit/:id",
    component: ClinicForm,
    meta: { title: "Edit Klinik" },
  },
];

export default routes;
