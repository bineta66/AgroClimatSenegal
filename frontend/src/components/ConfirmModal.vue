<script setup>
import { computed } from "vue";
const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "Confirmer la suppression" },
  message: { type: String, default: "Êtes-vous sûr de vouloir supprimer cet élément ?" },
  itemName: { type: String, default: "" },
  confirmLabel: { type: String, default: "Supprimer" },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "confirm"]);

const displayMessage = computed(() => {
  if (props.itemName) {
    return props.message.replace("{item}", props.itemName);
  }
  return props.message;
});

const handleClose = () => {
  emit("close");
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-slate-900/45 grid place-items-center z-50 p-5" @click.self="handleClose">
    <div class="bg-white rounded-2xl w-full max-w-[420px] shadow-lg flex flex-col items-center text-center p-6 gap-3">
      <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 grid place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold text-slate-900 m-0">{{ title }}</h3>
      <p class="text-sm text-slate-500 m-0 leading-relaxed">{{ displayMessage }}</p>

      <div class="flex items-center justify-end gap-2 w-full mt-1">
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" @click="handleClose" :disabled="loading">
          Annuler
        </button>
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border-0 bg-danger text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed" @click="handleConfirm" :disabled="loading">
          {{ loading ? "Suppression..." : confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
