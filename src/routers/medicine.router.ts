import { RouteRecordRaw } from "vue-router";
import MedicineList from "../pages/medicine/MedicineList.vue";
import MedicineForm from "../pages/medicine/MedicineForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "MedicineList", path: "", component: MedicineList },
  {
    name: "MedicineAdd",
    path: "tambah",
    component: MedicineForm,
    meta: { title: "Tambah Obat" },
  },
  {
    name: "MedicineEdit",
    path: "edit/:id",
    component: MedicineForm,
    meta: { title: "Edit Obat" },
  },
];

export default routes;
