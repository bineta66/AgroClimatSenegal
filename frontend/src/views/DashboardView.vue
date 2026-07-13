<script setup>
import { computed, onMounted, ref } from "vue";
import { useInventoryStore } from "../stores/inventory";
import Sidebar from "../components/Sidebar.vue";
import TopHeader from "../components/TopHeader.vue";
import KpiCard from "../components/KpiCard.vue";
import Chart from "../components/Chart.vue";
import Icon from "../components/Icon.vue";
import WarehouseAuditModal from "../components/WarehouseAuditModal.vue";

const inventory = useInventoryStore();

const warehouses = computed(() => inventory.warehouses);
const products = computed(() => inventory.products);

const totalWarehouses = computed(() => warehouses.value.length);
const totalProducts = computed(() => products.value.length);
const totalStock = computed(() =>
  products.value.reduce((s, p) => s + (Number(p.quantite) || 0), 0)
);
const expiredProducts = computed(
  () => products.value.filter((p) => p.etat === "perime").length
);

const availability = computed(() => {
  const c = { disponible: 0, reserve: 0, perime: 0 };
  for (const p of products.value) {
    if (p.etat === "perime") c.perime++;
    else if (p.etat === "reserve") c.reserve++;
    else c.disponible++;
  }
  return c;
});
const availabilityTotal = computed(() => products.value.length);

const stockByWarehouse = computed(() =>
  warehouses.value.map((w) => ({
    name: w.nom,
    stock: products.value
      .filter((p) => p.entrepot === w.id)
      .reduce((s, p) => s + (Number(p.quantite) || 0), 0),
  }))
);

const showAuditModal = ref(false);
const selectedWarehouseForAudit = ref(null);

const openAuditModal = (w) => {
  selectedWarehouseForAudit.value = w;
  showAuditModal.value = true;
};

const closeAuditModal = () => {
  showAuditModal.value = false;
  selectedWarehouseForAudit.value = null;
};

const statusLabel = {
  disponible: "Disponible",
  reserve: "Réservé",
  perime: "Périmé",
};

onMounted(() => inventory.refresh());
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <TopHeader />

      <div class="px-5 pt-6 pb-8 flex flex-col gap-5">
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Total Entrepôt" :value="totalWarehouses"" color="blue">
            <template #icon><Icon name="warehouse" :size="24" /></template>
          </KpiCard>
          <KpiCard label="Total Produits" :value="totalProducts"  color="green">
            <template #icon><Icon name="box" :size="24" /></template>
          </KpiCard>
          <KpiCard label="Total Stock Quantité" :value="totalStock" color="orange">
            <template #icon><Icon name="layers" :size="24" /></template>
          </KpiCard>
          <KpiCard label="Produits expirés" :value="expiredProducts"  color="red">
            <template #icon><Icon name="alert" :size="24" /></template>
          </KpiCard>
        </section>

        <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold m-0">Répartition des stocks</h2>
              <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">Disponibilité</span>
            </div>
            <div class="flex items-center gap-4">
              <Chart
                type="doughnut"
                :labels="['Disponible', 'Réservé', 'Périmé']"
                :values="[availability.disponible, availability.reserve, availability.perime]"
                :colors="['#16a34a', '#f59e0b', '#dc2626']"
                :centerText="availabilityTotal"
              />
              <ul class="list-none p-0 m-0 flex flex-col gap-3 text-sm">
                <li class="flex items-center"><span class="w-2.5 h-2.5 rounded inline-block mr-2 bg-success"></span>Disponible <b class="ml-1.5">{{ availability.disponible }}</b></li>
                <li class="flex items-center"><span class="w-2.5 h-2.5 rounded inline-block mr-2 bg-warning"></span>Réservé <b class="ml-1.5">{{ availability.reserve }}</b></li>
                <li class="flex items-center"><span class="w-2.5 h-2.5 rounded inline-block mr-2 bg-danger"></span>Périmé <b class="ml-1.5">{{ availability.perime }}</b></li>
              </ul>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold m-0">Stock par entrepôt</h2>
              <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">Quantité</span>
            </div>
            <Chart
              type="bar"
              :labels="stockByWarehouse.map((w) => w.name)"
              :values="stockByWarehouse.map((w) => w.stock)"
              :colors="['#2563eb']"
            />
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4">
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold m-0">Recent Products</h2>
              <span class="text-xs text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{{ products.length }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Produit</th>
                    <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Entrepôt</th>
                    <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Quantité</th>
                    <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Status</th>
                    <th class="text-left text-xs uppercase tracking-wide text-slate-500 font-semibold p-3 border-b border-slate-200">Expiration Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in products" :key="p.id">
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
                  </tr>
                  <tr v-if="!products.length">
                    <td colspan="5" class="p-3 border-b border-slate-200 text-sm text-slate-500 italic">Aucun produit.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <WarehouseAuditModal
          :show="showAuditModal"
          :warehouse="selectedWarehouseForAudit"
          @close="closeAuditModal"
        />
      </div>
    </div>
  </div>
</template>
