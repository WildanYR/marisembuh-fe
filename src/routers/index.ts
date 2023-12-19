import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../pages/HelloWorld.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: "HelloWorld", path: "/", component: HelloWorld }],
});

export default router;
