import { RouteRecordRaw } from "vue-router";
import TreatmentList from "../pages/treatment/TreatmentList.vue";
import TreatmentForm from "../pages/treatment/TreatmentForm.vue";
import TreatmentPatientList from "../pages/treatment/TreatmentPatientList.vue";

const routes: RouteRecordRaw[] = [
  { name: "TreatmentPatientList", path: "", component: TreatmentPatientList },
  {
    name: "TreatmentList",
    path: "pasien/:patientId",
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
    path: "tambah/pasien/:patientId",
    component: TreatmentForm,
    meta: { title: "Tambah Perawatan" },
  },
  {
    name: "TreatmentEdit",
    path: "edit/:id",
    component: TreatmentForm,
    meta: { title: "Edit Perawatan" },
  },
];

export default routes;
