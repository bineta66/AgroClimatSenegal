<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import Icon from "../components/Icon.vue";

const username = ref("");
const password = ref("");
const remember = ref(true);
const error = ref(null);
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
//  la fonction la plus importante.
// Cette fonction est appelée quand on clique sur : se connecter
const handleLogin = async () => {
  error.value = null;
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push("/dashboard");
  } catch (e) {
    error.value = e.detail || "Identifiants invalides";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-slate-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
      <div class="flex items-center justify-center gap-2.5 px-2 pb-5">
        <span class="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center">
          <Icon name="leaf" :size="22" />
        </span>
        <span class="text-xl font-bold tracking-tight">
          Eco-Stock
        </span>
      </div>

     
      <p class="mt-1 text-center text-slate-500 text-sm">
        Gérez vos entrepôts et vos stocks alimentaires en toute simplicité.
      </p>

      <form class="mt-5 flex flex-col gap-4" @submit.prevent="handleLogin">
        <label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Nom utilisateur
          <input v-model="username" class="w-full p-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" autocomplete="username" />
        </label>

        <label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Mot de passe
          <input
            v-model="password"
            type="password"
            class="w-full p-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            autocomplete="current-password"
          />
        </label>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              v-model="remember"
              class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
            Remember me
          </label>
          <a href="#" class="text-primary font-medium hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <button type="submit" :disabled="loading" class="inline-flex items-center justify-center gap-1.5 bg-primary text-white border-0 px-3.5 py-2.5 rounded-lg font-semibold text-sm transition hover:brightness-110 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed w-full">
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
      </form>

      <p class="text-center text-xs text-slate-400 mt-6">
        © 2026 Eco-Stock. Tous droits réservés.
      </p>
    </div>
  </div>
</template>
