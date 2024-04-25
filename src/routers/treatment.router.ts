import { RouteRecordRaw } from "vue-router";
import TreatmentList from "../pages/treatment/TreatmentList.vue";
import TreatmentForm from "../pages/treatment/TreatmentForm.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "TreatmentList",
    path: "",
    component: TreatmentList,
  },
  {
    name: "TreatmentDetail",
    path: "detail/:id",
    component: TreatmentForm,
    meta: { title: "Detail Perawatan", readOnly: true },
  },
  {
    name: "TreatmentAdd",
    path: "tambah",
    component: TreatmentForm,
    meta: { title: "Tambah Perawatan", submitMode: "ADD" },
  },
  {
    name: "TreatmentFill",
    path: "pasien-datang/:patientId",
    component: TreatmentForm,
    meta: { title: "Lengkapi Perawatan", submitMode: "ADD" },
  },
  {
    name: "TreatmentEdit",
    path: "edit/:id",
    component: TreatmentForm,
    meta: { title: "Edit Perawatan", submitMode: "EDIT" },
  },
];

export default routes;
