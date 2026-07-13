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

const products = computed(() =>
  inventory.products.filter((p) => p.entrepot === warehouse.value?.id)
);

const totalStock = computed(() =>
  products.value.reduce((sum, p) => sum + (Number(p.quantite) || 0), 0)
);

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-slate-900/45 grid place-items-center z-50 p-5" @click.self="close">
    <div class="bg-white rounded-2xl w-full max-w-[520px] shadow-lg flex flex-col">
      <div class="flex items-start justify-between px-5 pt-5">
        <div>
          <h2 class="text-base font-semibold text-slate-900 m-0">{{ warehouse?.nom }}</h2>
          <p class="text-sm text-slate-500 mt-1">Détails de l'entrepôt</p>
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Nom de l'entrepôt</span>
            <span class="text-sm text-slate-900 font-semibold">{{ warehouse?.nom }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Emplacement / Ville</span>
            <span class="text-sm text-slate-900 font-semibold">{{ warehouse?.localisation || "—" }}</span>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-6.52-2 19.79 19.79 0 0 1-6.52-2A2 2 0 0 1 2 19.92v-3"/><path d="M20 4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0 0-4z"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Capacité maximale</span>
            <span class="text-sm text-slate-900 font-semibold">{{ warehouse?.capacite ?? "—" }} sacs/bidons</span>
          </div>
        </div>

        <div v-if="warehouse?.description" class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <svg class="text-slate-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Description</span>
            <span class="text-sm text-slate-900 font-semibold">{{ warehouse.description }}</span>
          </div>
        </div>

        <div v-else class="text-sm text-slate-400 italic px-1">
          Aucune description fournie.
        </div>

        <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <svg class="text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M11 16v-6"/><path d="M15 16V8"/><path d="M19 16v-4"/>
          </svg>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-slate-500 font-medium">Stock total</span>
            <span class="text-sm text-slate-900 font-semibold">{{ totalStock }} sac(s)/bidon(s) · {{ products.length }} produit(s)</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-xs text-slate-500 font-semibold uppercase tracking-wide">Produits de l'entrepôt</span>
          <div v-if="products.length" class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            <div
              v-for="p in products"
              :key="p.id"
              class="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="text-sm text-slate-900 font-semibold truncate">{{ p.nom }}</span>
                <span class="text-xs text-slate-500">Quantité : {{ p.quantite ?? "—" }}</span>
              </div>
              <span
                class="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                :class="{
                  'bg-emerald-50 text-emerald-600': p.etat === 'disponible',
                  'bg-amber-50 text-amber-600': p.etat === 'reserve',
                  'bg-red-50 text-red-600': p.etat === 'perime',
                }"
              >{{ p.etat }}</span>
            </div>
          </div>
          <div v-else class="text-sm text-slate-400 italic px-1">
            Aucun produit dans cet entrepôt.
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end px-5 py-4">
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" @click="close">Fermer</button>
      </div>
    </div>
  </div>
</template>
