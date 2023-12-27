import { RouteRecordRaw } from "vue-router";
import PatientList from "../pages/patient/PatientList.vue";
import PatientForm from "../pages/patient/PatientForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "PatientList", path: "", component: PatientList },
  {
    name: "PatientDetail",
    path: ":id",
    component: PatientForm,
    meta: { title: "Detail Pasien", readOnly: true },
  },
  {
    name: "PatientAdd",
    path: "tambah",
    component: PatientForm,
    meta: { title: "Tambah Pasien" },
  },
  {
    name: "PatientEdit",
    path: "edit/:id",
    component: PatientForm,
    meta: { title: "Edit Pasien" },
  },
];

export default routes;
