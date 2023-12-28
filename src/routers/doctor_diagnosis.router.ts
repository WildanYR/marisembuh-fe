import { RouteRecordRaw } from "vue-router";
import DoctorDiagnosisList from "../pages/doctor_diagnosis/DoctorDiagnosisList.vue";
import DoctorDiagnosisForm from "../pages/doctor_diagnosis/DoctorDiagnosisForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "DoctorDiagnosisList", path: "", component: DoctorDiagnosisList },
  {
    name: "DoctorDiagnosisAdd",
    path: "tambah",
    component: DoctorDiagnosisForm,
    meta: { title: "Tambah Diagnosa Dokter" },
  },
  {
    name: "DoctorDiagnosisEdit",
    path: "edit/:id",
    component: DoctorDiagnosisForm,
    meta: { title: "Edit Diagnosa Dokter" },
  },
];

export default routes;
