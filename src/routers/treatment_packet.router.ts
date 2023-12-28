import { RouteRecordRaw } from "vue-router";
import TreatmentPacketList from "../pages/treatment_packet/TreatmentPacketList.vue";
import TreatmentPacketForm from "../pages/treatment_packet/TreatmentPacketForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "TreatmentPacketList", path: "", component: TreatmentPacketList },
  {
    name: "TreatmentPacketAdd",
    path: "tambah",
    component: TreatmentPacketForm,
    meta: { title: "Tambah Paket Perawatan" },
  },
  {
    name: "TreatmentPacketEdit",
    path: "edit/:id",
    component: TreatmentPacketForm,
    meta: { title: "Edit Paket Perawatan" },
  },
];

export default routes;
