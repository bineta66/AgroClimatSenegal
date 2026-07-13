<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useInventoryStore } from "../stores/inventory";
import Icon from "./Icon.vue";
import WarehouseAddModal from "./WarehouseAddModal.vue";
import { useSidebar } from "../composables/useSidebar";

const auth = useAuthStore();
const inventory = useInventoryStore();
const router = useRouter();
const route = useRoute();
const { toggleSidebar } = useSidebar();

const menuOpen = ref(false);
const showAddModal = ref(false);

const pageTitle = computed(() => {
  const map = {
    Dashboard: "Tableau de bord",
    Warehouses: "Entrepôts",
    Products: "Produits",
    Transfers: "Transferts",
    Settings: "Paramètres",
  };
  return map[route.meta.title] || "Tableau de bord";
});

const openAddModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const savedAddModal = () => {
  inventory.refresh();
  showAddModal.value = false;
};

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<template>
  <header class="flex items-center justify-between gap-4 px-7 py-5 bg-white border-b border-slate-200 sticky top-0 z-20">
    <div class="flex flex-col gap-0.5">
      <h1 class="m-0 text-xl font-semibold tracking-tight">
        {{ pageTitle }}
      </h1>
      <p class="mt-1 text-slate-500 text-sm">
        Bienvenue, {{ auth.user?.username || "Admin" }}
      </p>
    </div>

    <div class="flex items-center gap-3">
      <button class="w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-600 grid place-items-center max-[860px]:flex hidden" aria-label="Menu" @click="toggleSidebar">
        <Icon name="grid" :size="20" />
      </button>


      <button class="relative w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-500 grid place-items-center" aria-label="Notifications">
        <Icon name="bell" :size="20" />
        <span class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-white"></span>
      </button>

     
    </div>

    <WarehouseAddModal :show="showAddModal" @close="closeAddModal" @saved="savedAddModal" />

    <div v-if="menuOpen" class="fixed inset-0 z-20" @click="menuOpen = false"></div>
  </header>
</template>
