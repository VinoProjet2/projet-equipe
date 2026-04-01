import { createRouter, createWebHistory } from "vue-router";
import CreationUsager from "../pages/usager/creationUsager.vue";

const routes = [
  {
    path: "/creation-usager",
    component: CreationUsager,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
