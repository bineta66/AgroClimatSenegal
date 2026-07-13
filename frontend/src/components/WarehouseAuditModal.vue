<script setup>
import { computed } from "vue";
import { useInventoryStore } from "../stores/inventory";

const props = defineProps({
  warehouse: { type: Object, required: false },
  show: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

const inventory = useInventoryStore();
const warehouse = computed(() => props.warehouse);

const audit = computed(() => {
  if (!warehouse.value?.id) return null;
  const products = inventory.products.filter((p) => p.entrepot === warehouse.value.id);
  const totalStock = products.reduce((s, p) => s + (Number(p.quantite) || 0), 0);

  const byEtat = {
    disponible: products.filter((p) => p.etat === "disponible").length,
    reserve: products.filter((p) => p.etat === "reserve").length,
    perime: products.filter((p) => p.etat === "perime").length,
  };

  const lastUpdated = products
    .map((p) => p.updated_at || p.date_expiration)
    .filter(Boolean)
    .sort()
    .pop();

  return {
    productCount: products.length,
    totalStock,
    byEtat,
    lastUpdated: lastUpdated || null,
  };
});

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-slate-900/45 grid place-items-center z-50 p-5" @click.self="close">
    <div class="bg-white rounded-2xl w-full max-w-[480px] shadow-lg flex flex-col">
      <div class="flex items-start justify-between px-5 pt-5">
        <div>
          <h2 class="text-base font-semibold text-slate-900 m-0">Audit - {{ warehouse?.nom }}</h2>
          <p class="text-sm text-slate-500 mt-1">Historique et résumé d'activité de l'entrepôt</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="border-0 bg-transparent cursor-pointer p-2 rounded-lg flex items-center justify-center transition hover:bg-slate-100 text-slate-500" title="Fermer" @click="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="px-5 py-4 flex flex-col gap-3">
        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Entrepôt</span>
            <span class="text-sm text-slate-900 font-semibold">{{ warehouse?.nom }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M11 16v-6"/><path d="M15 16V8"/><path d="M19 16v-4"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Nombre de produits</span>
            <span class="text-sm text-slate-900 font-semibold">{{ audit?.productCount }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Stock total</span>
            <span class="text-sm text-slate-900 font-semibold">{{ audit?.totalStock }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Par état</span>
            <span class="text-sm text-slate-900 font-semibold">Disponible : {{ audit?.byEtat?.disponible ?? 0 }} | Réservé : {{ audit?.byEtat?.reserve ?? 0 }} | Périmé : {{ audit?.byEtat?.perime ?? 0 }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Dernière mise à jour</span>
            <span class="text-sm text-slate-900 font-semibold">{{ audit?.lastUpdated ? new Date(audit.lastUpdated).toLocaleString("fr-FR") : "—" }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end px-5 py-4">
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" @click="close">Fermer</button>
      </div>
    </div>
  </div>
</template>
