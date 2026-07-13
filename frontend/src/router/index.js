import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProductsView from "../views/ProductsView.vue";
import WarehousesView from "../views/WarehousesView.vue";
import { isTokenExpired, refreshToken } from "../api/client";
import LoaderView from "../components/loader.vue";

const routes = [
  {
    path: "/",
    name: "loader",
    component: LoaderView,
  },

  {
    path: "/login",
    component: LoginView,
    meta: { requiresGuest: true },
  },

  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true, title: "Dashboard" },
  },

  {
    path: "/warehouses",
    component: WarehousesView,
    meta: { requiresAuth: true, title: "Warehouses" },
  },

  {
    path: "/products",
    component: ProductsView,
    meta: { requiresAuth: true, title: "Products" },
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const accessValid = !isTokenExpired();
  const hasRefresh = !!localStorage.getItem("refresh");

  if (to.meta.requiresAuth) {
    if (accessValid) return;
    if (hasRefresh) {
      const ok = await refreshToken();
      if (ok) return;
    }
    return "/login";
  }

  if (to.meta.requiresGuest && (accessValid || hasRefresh)) {
    return "/dashboard";
  }
});

export default router;
