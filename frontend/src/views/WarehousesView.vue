<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useInventoryStore } from "../stores/inventory";
import Sidebar from "../components/Sidebar.vue";
import TopHeader from "../components/TopHeader.vue";
import Icon from "../components/Icon.vue";
import WarehouseAddModal from "../components/WarehouseAddModal.vue";
import WarehouseDetailModal from "../components/WarehouseDetailModal.vue";
import WarehouseEditModal from "../components/WarehouseEditModal.vue";
import WarehouseAuditModal from "../components/WarehouseAuditModal.vue";

const inventory = useInventoryStore();
const search = ref("");
const stockFilter = ref("all");
const page = ref(1);
const pageSize = 4;
const showAddModal = ref(false);
const showDetailModal = ref(false);
const showAuditModal = ref(false);
const showEditModal = ref(false);
const selectedWarehouse = ref(null);
const selectedWarehouseForDetail = ref(null);
const selectedWarehouseForAudit = ref(null);

onMounted(() => inventory.refresh());

const warehouses = computed(() => inventory.warehouses);
const products = computed(() => inventory.products);

const stockByWarehouse = computed(() => {
  const map = Object.create(null);
  for (const p of products.value) {
    map[p.entrepot] = (map[p.entrepot] || 0) + (Number(p.quantite) || 0);
  }
  return map;
});

const stockOf = (w) => stockByWarehouse.value[w.id] || 0;

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  return warehouses.value.filter((w) => {
    const matchSearch =
      !q ||
      w.nom.toLowerCase().includes(q) ||
      (w.localisation && w.localisation.toLowerCase().includes(q));
    const stock = stockOf(w);
    const matchStock =
      stockFilter.value === "all" ||
      (stockFilter.value === "empty" && stock === 0) ||
      (stockFilter.value === "low" && stock > 0 && stock <= 50) ||
      (stockFilter.value === "medium" && stock > 50 && stock <= 200) ||
      (stockFilter.value === "high" && stock > 200);
    return matchSearch && matchStock;
  });
});

const warehouseRows = computed(() =>
  filtered.value.map((w) => ({ ...w, stock: stockOf(w) }))
);

const totalWarehousePages = computed(() =>
  Math.max(1, Math.ceil(warehouseRows.value.length / pageSize))
);

const pagedWarehouses = computed(() => {
  const start = (page.value - 1) * pageSize;
  return warehouseRows.value.slice(start, start + pageSize);
});

watch(filtered, () => {
  if (page.value > totalWarehousePages.value) page.value = 1;
});

const openAddModal = () => {
  selectedWarehouse.value = null;
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
  selectedWarehouse.value = null;
};

const savedAddModal = () => {
  closeAddModal();
};

const openDetailModal = (w) => {
  selectedWarehouseForDetail.value = w;
  showDetailModal.value = true;
};

const openEditModal = (w) => {
  selectedWarehouse.value = w;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedWarehouse.value = null;
};

const openAuditModal = (w) => {
  selectedWarehouseForAudit.value = w;
  showAuditModal.value = true;
};

const closeAuditModal = () => {
  showAuditModal.value = false;
  selectedWarehouseForAudit.value = null;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedWarehouseForDetail.value = null;
};
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <TopHeader />

      <div class="px-5 pt-6 pb-8 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="m-0 text-xl font-semibold tracking-tight">Entrepôts</h1>
            <p class="mt-1 text-slate-500 text-sm">Consultez et gérez tous vos entrepôts.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{{ filtered.length }}</span>
            <button class="inline-flex items-center gap-1.5 bg-primary text-white border-0 px-3.5 py-2.5 rounded-lg font-semibold text-sm transition hover:brightness-110 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" @click="openAddModal">
              <Icon name="plus" :size="18" />
              Nouvel entrepôt
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
  <input
    v-model="search"
    placeholder="Rechercher par nom ou localisation..."
    class="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  />

  <select
    v-model="stockFilter"
    class="p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
  >
    <option value="all">Tous les stocks</option>
    <option value="empty">Vide (0)</option>
    <option value="low">Faible (1-50)</option>
    <option value="medium">Moyen (51-200)</option>
    <option value="high">Élevé (>200)</option>
  </select>
</div>

        <p v-if="inventory.error" class="text-red-600 text-sm">{{ inventory.error }}</p>

        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold m-0">Entrepôts</h2>
            <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{{ filtered.length }}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Nom entrepôts</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Localisation</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Capacité</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="w in pagedWarehouses" :key="w.id">
                  <td class="p-3 border-b border-slate-200 text-sm font-semibold">{{ w.nom }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">{{ w.localisation || "—" }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">{{ w.capacite ?? "—" }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">
                    <div class="flex gap-1.5">
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-sky-500 grid place-items-center transition hover:bg-sky-50 hover:text-sky-600" title="Voir" @click="openDetailModal(w)"><Icon name="eye" :size="16" /></button>
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-amber-500 grid place-items-center transition hover:bg-amber-50 hover:text-amber-600" title="Modifier" @click="openEditModal(w)"><Icon name="edit" :size="16" /></button>
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-emerald-500 grid place-items-center transition hover:bg-emerald-50 hover:text-emerald-600" title="Audit" @click="openAuditModal(w)"><Icon name="audit" :size="16" /></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!pagedWarehouses.length">
                  <td colspan="5" class="p-3 border-b border-slate-200 text-sm text-slate-500 italic">Aucun entrepôt.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalWarehousePages > 1" class="flex items-center justify-between mt-4">
            <span class="text-xs text-slate-500">Page {{ page }} / {{ totalWarehousePages }}</span>
            <div class="flex items-center gap-1.5">
              <button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page === 1" @click="page--">Précédent</button>
              <button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page === totalWarehousePages" @click="page++">Suivant</button>
            </div>
          </div>
        </div>

        <WarehouseAddModal :show="showAddModal" @saved="savedAddModal" @close="closeAddModal" />

        <WarehouseDetailModal
          :show="showDetailModal"
          :warehouse="selectedWarehouseForDetail"
          @close="closeDetailModal"
        />

        <WarehouseEditModal
          :show="showEditModal"
          :warehouse="selectedWarehouse"
          @saved="closeEditModal"
          @close="closeEditModal"
        />

        <WarehouseAuditModal
          :show="showAuditModal"
          :warehouse="selectedWarehouseForAudit"
          @close="closeAuditModal"
        />
      </div>
    </div>
  </div>
</template>
