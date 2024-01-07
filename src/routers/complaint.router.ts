import { RouteRecordRaw } from "vue-router";
import ComplaintList from "../pages/complaint/ComplaintList.vue";
import ComplaintForm from "../pages/complaint/ComplaintForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "ComplaintList", path: "", component: ComplaintList },
  {
    name: "ComplaintAdd",
    path: "tambah",
    component: ComplaintForm,
    meta: { title: "Tambah Keluhan" },
  },
  {
    name: "ComplaintEdit",
    path: "edit/:id",
    component: ComplaintForm,
    meta: { title: "Edit Keluhan" },
  },
];

export default routes;
