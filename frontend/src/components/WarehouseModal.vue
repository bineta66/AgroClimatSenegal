<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore } from "../stores/inventory";

const props = defineProps({
  warehouse: { type: Object, default: null },
  mode: { type: String, default: "edit" },
});
const emit = defineEmits(["close", "saved"]);

const inventory = useInventoryStore();
const nom = ref("");
const localisation = ref("");
const capacite = ref("");
const description = ref("");
const loading = ref(false);
const errors = ref({ nom: "", localisation: "", capacite: "" });

const isEdit = computed(() => !!props.warehouse);
const title = computed(() => (isEdit.value ? "Modifier l'entrepôt" : "Ajouter un nouvel entrepôt"));
const subtitle = isEdit.value ? "" : "Créez un nouvel entrepôt pour organiser vos stocks alimentaires.";

onMounted(() => {
  if (props.warehouse) {
    nom.value = props.warehouse.nom || "";
    localisation.value = props.warehouse.localisation || "";
    capacite.value = props.warehouse.capacite ?? "";
    description.value = props.warehouse.description || "";
  }
});

const validate = () => {
  const newErrors = { nom: "", localisation: "", capacite: "" };
  let valid = true;

  if (!nom.value.trim()) {
    newErrors.nom = "Ce champ est requis";
    valid = false;
  }
  if (!localisation.value.trim()) {
    newErrors.localisation = "Ce champ est requis";
    valid = false;
  }
  if (!capacite.value || isNaN(Number(capacite.value))) {
    newErrors.capacite = "Veuillez saisir un nombre valide";
    valid = false;
  }

  errors.value = newErrors;
  return valid;
};

const submit = async () => {
  if (!validate()) return;

  loading.value = true;
  errors.value = { nom: "", localisation: "", capacite: "" };
  const payload = {
    nom: nom.value.trim(),
    localisation: localisation.value.trim(),
    capacite: Number(capacite.value),
    description: description.value.trim(),
  };
  try {
    if (isEdit.value) {
      await inventory.updateWarehouse(props.warehouse.id, payload);
    } else {
      await inventory.createWarehouse(payload);
    }
    emit("saved");
    emit("close");
  } catch (e) {
    errors.value.general = e.detail || e.error || "Échec de l'enregistrement";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/45 grid place-items-center z-50 p-5" @click.self="emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-[480px] shadow-lg flex flex-col">
      <div class="flex items-start justify-between px-5 pt-5">
        <div>
          <h2 class="text-base font-semibold text-slate-900 m-0">{{ title }}</h2>
          <p v-if="subtitle" class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
        </div>
        <button class="border-0 bg-transparent cursor-pointer p-2 rounded-lg flex items-center justify-center transition hover:bg-slate-100 text-slate-500" title="Fermer" @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <div class="px-5 py-4 flex flex-col gap-3">
        <p v-if="errors.general" class="text-sm text-red-500 font-medium mb-1">{{ errors.general }}</p>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <svg class="text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Nom de l'entrepôt <span class="text-red-500 font-semibold">*</span>
          </label>
          <input v-model="nom" type="text" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.nom }" placeholder="ex: Dakar Central B" />
          <span v-if="errors.nom" class="text-xs text-red-500 font-medium">{{ errors.nom }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <svg class="text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-12 13-12 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Emplacement / Ville <span class="text-red-500 font-semibold">*</span>
          </label>
          <input v-model="localisation" type="text" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.localisation }" placeholder="ex: Dakar, Sénégal" />
          <span v-if="errors.localisation" class="text-xs text-red-500 font-medium">{{ errors.localisation }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <svg class="text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M11 16v-6"/><path d="M15 16V8"/><path d="M19 16v-4"/>
            </svg>
            Capacité maximale (sacs/bidons) <span class="text-red-500 font-semibold">*</span>
          </label>
          <input v-model="capacite" type="number" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.capacite }" placeholder="5000" />
          <span v-if="errors.capacite" class="text-xs text-red-500 font-medium">{{ errors.capacite }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <svg class="text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Description
            <span class="ml-auto text-xs text-slate-400 italic">Optionnel</span>
          </label>
          <textarea v-model="description" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y" rows="3" placeholder="Informations complémentaires sur l'entrepôt..."></textarea>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-5 py-4">
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" @click="emit('close')" :disabled="loading">Annuler</button>
        <button class="px-3.5 py-2.5 rounded-lg font-semibold text-sm border-0 bg-primary text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed" @click="submit" :disabled="loading">
          {{ loading ? "Enregistrement..." : "+ Enregistrer" }}
        </button>
      </div>
    </div>
  </div>
</template>
