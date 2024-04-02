import { RouteRecordRaw } from "vue-router";
import UserList from "../pages/user/UserList.vue";
import UserForm from "../pages/user/UserForm.vue";
import UserProfile from "../pages/user/UserProfile.vue";

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
  {
    name: "UserProfile",
    path: "profil",
    component: UserProfile,
  },
];

export default routes;
