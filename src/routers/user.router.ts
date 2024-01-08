import { RouteRecordRaw } from "vue-router";
import UserList from "../pages/user/UserList.vue";
import UserForm from "../pages/user/UserForm.vue";

const routes: RouteRecordRaw[] = [
  { name: "UserList", path: "", component: UserList },
  {
    name: "UserAdd",
    path: "tambah",
    component: UserForm,
    meta: { title: "Tambah User" },
  },
  {
    name: "UserEdit",
    path: "edit/:id",
    component: UserForm,
    meta: { title: "Edit User" },
  },
];

export default routes;
