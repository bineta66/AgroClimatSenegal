<script setup>
import { ref, computed } from "vue";
import { useInventoryStore } from "../stores/inventory";
import Icon from "./Icon.vue";

const props = defineProps({
  product: { type: Object, required: true },
});
const emit = defineEmits(["close", "transferred"]);

const inventory = useInventoryStore();
const destination = ref("");
const loading = ref(false);
const errors = ref({ destination: "" });

const warehouses = computed(() =>
  inventory.warehouses.filter((w) => w.id !== props.product.entrepot)
);

const submit = async () => {
  errors.value = { destination: "" };
  let valid = true;

  if (!destination.value) {
    errors.value.destination = "Veuillez sélectionner un entrepôt.";
    valid = false;
  }

  if (!valid) return;

  loading.value = true;
  try {
    await inventory.transferProduct(props.product.id, Number(destination.value));
    emit("transferred");
    emit("close");
  } catch (e) {
    errors.value.general = e.detail || e.error || "Échec du transfert";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/45 grid place-items-center z-50 p-5" @click.self="emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-[520px] shadow-lg flex flex-col">
      <div class="flex items-start justify-between px-5 pt-5">
        <div>
          <h2 class="text-base font-semibold text-slate-900 m-0">Transférer un produit</h2>
          <p class="text-sm text-slate-500 mt-1">Déplacer le stock vers un autre entrepôt.</p>
        </div>
        <button class="border-0 bg-transparent cursor-pointer p-2 rounded-lg flex items-center justify-center transition hover:bg-slate-100 text-slate-500" title="Fermer" @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <div class="px-5 py-4 flex flex-col gap-2.5">
        <p v-if="errors.general" class="text-sm text-red-500 font-medium">{{ errors.general }}</p>

        <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="w-9 h-9 rounded-lg bg-primary/10 text-primary grid place-items-center flex-shrink-0"><Icon name="box" :size="18" /></span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-900 m-0 truncate">{{ product.nom }}</p>
            <p class="text-xs text-slate-500 m-0">Stock : {{ product.quantite ?? 0 }} {{ product.unite || 'unités' }} · {{ product.entrepot_nom || product.entrepot }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Icon name="building" :size="16" class="text-slate-500" />
            Entrepôt destination <span class="text-red-500 font-semibold">*</span>
          </label>
          <select v-model="destination" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.destination }">
            <option :value="''" disabled>Sélectionner un entrepôt</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">
              {{ w.nom }}
            </option>
          </select>
          <span v-if="errors.destination" class="text-xs text-red-500 font-medium">{{ errors.destination }}</span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-5 py-4">
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" @click="emit('close')" :disabled="loading">Annuler</button>
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border-0 bg-primary text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed" @click="submit" :disabled="loading">
          {{ loading ? "Transfert..." : "+ Transférer" }}
        </button>
      </div>
    </div>
  </div>
</template>
