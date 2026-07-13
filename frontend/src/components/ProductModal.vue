<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore } from "../stores/inventory";

const props = defineProps({
  product: { type: Object, default: null },
});
const emit = defineEmits(["close", "saved"]);

const inventory = useInventoryStore();
const nom = ref("");
const quantite = ref("");
const dateExpiration = ref("");
const etat = ref("disponible");
const entrepot = ref("");
const description = ref("");
const loading = ref(false);
const errors = ref({});

const isEdit = computed(() => !!props.product);
const title = computed(() => (isEdit.value ? "Modifier le produit" : "Ajouter un produit"));

onMounted(() => {
  if (props.product) {
    nom.value = props.product.nom || "";
    quantite.value = props.product.quantite ?? "";
    dateExpiration.value = props.product.date_expiration || "";
    etat.value = props.product.etat || "disponible";
    entrepot.value = props.product.entrepot || "";
    description.value = props.product.description || "";
  }
});

const validate = () => {
  const newErrors = {};
  let valid = true;

  if (!nom.value.trim()) {
    newErrors.nom = "Ce champ est requis";
    valid = false;
  } else if (
    inventory.productNameExists(nom.value) &&
    (!isEdit.value || props.product?.nom?.trim().toLowerCase() !== nom.value.trim().toLowerCase())
  ) {
    newErrors.nom = "Ce nom de produit existe déjà.";
    valid = false;
  }
  if (!quantite.value || isNaN(Number(quantite.value))) {
    newErrors.quantite = "Veuillez saisir un nombre valide";
    valid = false;
  }
  if (!entrepot.value) {
    newErrors.entrepot = "Ce champ est requis";
    valid = false;
  }

  errors.value = newErrors;
  return valid;
};

const submit = async () => {
  if (!validate()) return;

  loading.value = true;
  errors.value = {};
  const payload = {
    nom: nom.value.trim(),
    quantite: Number(quantite.value),
    date_expiration: dateExpiration.value || null,
    etat: etat.value,
    entrepot: Number(entrepot.value),
    description: description.value.trim(),
  };
  try {
    if (isEdit.value) {
      await inventory.updateProduct(props.product.id, payload);
    } else {
      await inventory.createProduct(payload);
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
          <p class="text-sm text-slate-500 mt-1">{{ isEdit ? 'Modifiez les informations du produit.' : 'Créez un nouveau produit et associez-le à un entrepôt.' }}</p>
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
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Nom du produit <span class="text-red-500 font-semibold">*</span>
          </label>
          <input v-model="nom" type="text" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.nom }" placeholder="ex: Riz parfumé 25 kg" />
          <span v-if="errors.nom" class="text-xs text-red-500 font-medium">{{ errors.nom }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M11 16v-6"/><path d="M15 16V8"/><path d="M19 16v-4"/>
            </svg>
            Quantité <span class="text-red-500 font-semibold">*</span>
          </label>
          <input v-model="quantite" type="number" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.quantite }" placeholder="ex: 120" />
          <span v-if="errors.quantite" class="text-xs text-red-500 font-medium">{{ errors.quantite }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Date d'expiration
            </label>
            <input v-model="dateExpiration" type="date" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              État
            </label>
            <select v-model="etat" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
              <option value="perime">Périmé</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Entrepôt <span class="text-red-500 font-semibold">*</span>
          </label>
          <select v-model="entrepot" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" :class="{ 'border-red-500 bg-red-50': errors.entrepot }">
            <option :value="''" disabled>Sélectionner un entrepôt</option>
            <option v-for="w in inventory.warehouses" :key="w.id" :value="w.id">
              {{ w.nom }}
            </option>
          </select>
          <span v-if="errors.entrepot" class="text-xs text-red-500 font-medium">{{ errors.entrepot }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <svg class="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            Description
            <span class="ml-auto text-xs text-slate-400 italic">Optionnel</span>
          </label>
          <textarea v-model="description" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y" rows="2" placeholder="Informations complémentaires sur le produit..."></textarea>
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
