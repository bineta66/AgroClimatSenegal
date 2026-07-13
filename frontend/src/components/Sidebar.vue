<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Icon from "./Icon.vue";
import { useSidebar } from "../composables/useSidebar";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const { sidebarOpen, closeSidebar } = useSidebar();

const items = [
  { name: "Tableau de bord", icon: "grid", to: "/dashboard", color: "text-sky-500" },
  { name: "Entrepôts", icon: "building", to: "/warehouses", color: "text-emerald-500" },
  { name: "Produits", icon: "package", to: "/products", color: "text-violet-500" },
];

const isActive = (to) => route.path === to;

const navigate = (to) => {
  router.push(to);
  closeSidebar();
};

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<template>
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-slate-900/45 z-30 max-[860px]:block hidden"
    @click="closeSidebar"
  ></div>

  <aside
    class="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col p-5 sticky top-0 h-screen max-[860px]:fixed max-[860px]:inset-y-0 max-[860px]:left-0 max-[860px]:z-40 max-[860px]:shadow-xl max-[860px]:transition-transform max-[860px]:duration-300"
    :class="sidebarOpen ? 'max-[860px]:translate-x-0' : 'max-[860px]:-translate-x-full'"
  >
    <div class="flex items-center gap-2.5 px-2 pb-5">
      <span class="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center"><Icon name="leaf" :size="22" /></span>
      <span class="text-xl font-bold tracking-tight">Eco-Stock</span>
    </div>

    <nav class="flex flex-col gap-1 flex-1">
      <button
        v-for="item in items"
        :key="item.name"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left bg-transparent border-0 transition hover:bg-slate-50 hover:text-slate-900"
        :class="isActive(item.to) ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-500'"
        @click="navigate(item.to)"
      >
        <span
          v-if="isActive(item.to)"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md bg-primary"
        ></span>
        <Icon :name="item.icon" :size="19" :class="isActive(item.to) ? 'text-primary' : item.color" />
        <span>{{ item.name }}</span>
      </button>
    </nav>

    <button class="flex items-center gap-3 px-3 py-2.5 mt-3 rounded-lg border border-slate-200 bg-white text-danger font-semibold transition hover:bg-danger/10" @click="logout">
      <Icon name="logout" :size="19" />
      <span>Déconnexion</span>
    </button>
  </aside>
</template>
