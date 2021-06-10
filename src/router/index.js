import {
  createRouter,
  createWebHashHistory
} from "vue-router"

let routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: () => import("/@/view/home/index.vue"),
  },
  {
    name: "option",
    path: "/option",
    component: () => import("/@/view/option/index.vue"),
  },
  {
    name: "help",
    path: "/help",
    component: () => import("/@/view/help/index.vue"),
  },
  {
    name: "list",
    path: "/list",
    component: () => import("/@/view/list/index.vue"),
  },
  {
    name: "map",
    path: "/map",
    component: () => import("/@/view/map/index.vue"),
  },
];



const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router