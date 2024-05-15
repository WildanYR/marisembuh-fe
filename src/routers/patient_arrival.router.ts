import { RouteRecordRaw } from "vue-router";
import PatientArrivalList from "../pages/patient_arrival/PatientArrivalList.vue";
import PatientArrivalForm from "../pages/patient_arrival/PatientArrivalForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "PatientArrivalList", path: "", component: PatientArrivalList },
  {
    name: "PatientArrivalAdd",
    path: "tambah",
    component: PatientArrivalForm,
    meta: {
      title: "Tambah Kedatangan Pasien",
    },
  },
  {
    name: "PatientArrivalEdit",
    path: "edit/:id",
    component: PatientArrivalForm,
    meta: {
      title: "Edit Kedatangan Pasien",
    },
  },
];

export default routes;
