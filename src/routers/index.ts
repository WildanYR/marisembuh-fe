import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../pages/HelloWorld.vue";
import Login from "../pages/Login.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: "HelloWorld", path: "/", component: HelloWorld },
    { name: "Login", path: "/login", component: Login },
  ],
});

export default router;
