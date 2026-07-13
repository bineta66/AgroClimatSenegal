<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useInventoryStore } from "../stores/inventory";
import Sidebar from "../components/Sidebar.vue";
import TopHeader from "../components/TopHeader.vue";
import Icon from "../components/Icon.vue";
import ProductModal from "../components/ProductModal.vue";
import ProductDetailModal from "../components/ProductDetailModal.vue";
import TransferModal from "../components/TransferModal.vue";
import ConfirmModal from "../components/ConfirmModal.vue";

const inventory = useInventoryStore();
const search = ref("");
const filter = ref("all");
const entrepotFilter = ref("all");
const page = ref(1);
const pageSize = 4;

const warehouses = computed(() => inventory.warehouses);

const showProductModal = ref(false);
const showDetailModal = ref(false);
const showTransferModal = ref(false);
const showDeleteModal = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);
const deleteLoading = ref(false);

const statusLabel = {
  disponible: "Disponible",
  reserve: "Réservé",
  perime: "Périmé",
};

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  const entrepot = entrepotFilter.value;
  return inventory.products.filter((p) => {
    const matchSearch = !q || p.nom.toLowerCase().includes(q);
    const matchFilter = filter.value === "all" || p.etat === filter.value;
    const matchEntrepot =
      entrepot === "all" || p.entrepot === Number(entrepot);
    return matchSearch && matchFilter && matchEntrepot;
  });
});

const totalProductPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize))
);

const pagedProducts = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});

watch(filtered, () => {
  if (page.value > totalProductPages.value) page.value = 1;
});

const openCreateProduct = () => {
  selectedProduct.value = null;
  showProductModal.value = true;
};

const openEditProduct = (p) => {
  selectedProduct.value = p;
  showProductModal.value = true;
};

const openDetailProduct = (p) => {
  selectedProduct.value = p;
  showDetailModal.value = true;
};

const openTransferProduct = (p) => {
  selectedProduct.value = p;
  showTransferModal.value = true;
};

const handleDelete = (p) => {
  productToDelete.value = p;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!productToDelete.value) return;
  deleteLoading.value = true;
  try {
    await inventory.deleteProduct(productToDelete.value.id);
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
    productToDelete.value = null;
  }
};

const closeProductModal = () => {
  showProductModal.value = false;
  selectedProduct.value = null;
};

const savedProductModal = () => {
  closeProductModal();
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedProduct.value = null;
};

const closeTransferModal = () => {
  showTransferModal.value = false;
  selectedProduct.value = null;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

onMounted(() => inventory.refresh());
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <TopHeader />

      <div class="px-5 pt-6 pb-8 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="m-0 text-xl font-semibold tracking-tight">Produits</h1>
            <p class="mt-1 text-slate-500 text-sm">Consultez et gérez tous vos produits.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{{ filtered.length }}</span>
            <button class="inline-flex items-center gap-1.5 bg-primary text-white border-0 px-3.5 py-2.5 rounded-lg font-semibold text-sm transition hover:brightness-110 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" @click="openCreateProduct">
              <Icon name="plus" :size="18" />
              Nouveau produit
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
  <input
    v-model="search"
    placeholder="Rechercher un produit..."
    class="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  />

  <select
    v-model="entrepotFilter"
    class="p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
  >
    <option value="all">Tous les entrepôts</option>
    <option v-for="w in warehouses" :key="w.id" :value="w.id">
      {{ w.nom }}
    </option>
  </select>

  <select
    v-model="filter"
    class="p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
  >
    <option value="all">Tous les états</option>
    <option value="disponible">Disponible</option>
    <option value="reserve">Réservé</option>
    <option value="perime">Périmé</option>
  </select>
</div>

        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold m-0">Produits</h2>
            <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{{ filtered.length }}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Produit</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Entrepôts</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Quantité</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Status</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Expiration</th>
                  <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pagedProducts" :key="p.id">
                  <td class="p-3 border-b border-slate-200 text-sm font-semibold">{{ p.nom }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">{{ p.entrepot_nom || "—" }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">{{ p.quantite }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="{
                      'bg-success/10 text-success': p.etat === 'disponible',
                      'bg-warning/10 text-[#b45309]': p.etat === 'reserve',
                      'bg-danger/10 text-danger': p.etat === 'perime',
                    }">
                      {{ statusLabel[p.etat] || p.etat }}
                    </span>
                  </td>
                  <td class="p-3 border-b border-slate-200 text-sm">{{ p.date_expiration }}</td>
                  <td class="p-3 border-b border-slate-200 text-sm">
                    <div class="flex gap-1.5">
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-sky-500 grid place-items-center transition hover:bg-sky-50 hover:text-sky-600" title="Voir" @click="openDetailProduct(p)"><Icon name="eye" :size="16" /></button>
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-amber-500 grid place-items-center transition hover:bg-amber-50 hover:text-amber-600" title="Modifier" @click="openEditProduct(p)"><Icon name="edit" :size="16" /></button>
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-violet-500 grid place-items-center transition hover:bg-violet-50 hover:text-violet-600" title="Transférer" @click="openTransferProduct(p)"><Icon name="truck" :size="16" /></button>
                      <button class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-danger grid place-items-center transition hover:bg-danger/10" title="Supprimer" @click="handleDelete(p)"><Icon name="trash" :size="16" /></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!pagedProducts.length">
                  <td colspan="6" class="p-3 border-b border-slate-200 text-sm text-slate-500 italic">Aucun produit.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalProductPages > 1" class="flex items-center justify-between mt-4">
            <span class="text-xs text-slate-500">Page {{ page }} / {{ totalProductPages }}</span>
            <div class="flex items-center gap-1.5">
              <button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page === 1" @click="page--">Précédent</button>
              <button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page === totalProductPages" @click="page++">Suivant</button>
            </div>
          </div>
        </div>

        <ProductModal
          v-if="showProductModal"
          :product="selectedProduct"
          @close="closeProductModal"
          @saved="savedProductModal"
        />

        <ProductDetailModal
          :show="showDetailModal"
          :product="selectedProduct"
          @close="closeDetailModal"
        />

        <TransferModal
          v-if="showTransferModal"
          :product="selectedProduct"
          @transferred="inventory.refresh"
          @close="closeTransferModal"
        />

        <ConfirmModal
          :show="showDeleteModal"
          :item-name="productToDelete?.nom"
          message="Êtes-vous sûr de vouloir supprimer le produit {item} ?"
          confirm-label="Supprimer"
          :loading="deleteLoading"
          @close="closeDeleteModal"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  </div>
</template>
