<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { isTokenExpired, refreshToken } from "../api/client";
import Icon from "./Icon.vue";

const router = useRouter();

onMounted(async () => {
  const hasRefresh = !!localStorage.getItem("refresh");
  if (!isTokenExpired() || hasRefresh) {
    if (isTokenExpired() && hasRefresh) await refreshToken();
    setTimeout(() => router.push("/dashboard"), 4000);
  } else {
    setTimeout(() => router.push("/login"), 4000);
  }
});
</script>


<template>
  <div class="loader-container">

    <div class="flex items-center gap-5 px-4 pb-8">
      <span class="w-16 h-16 rounded-2xl bg-primary text-white grid place-items-center shadow-lg">
        <Icon name="leaf" :size="36" />
      </span>

      <span class="text-4xl font-extrabold tracking-tight text-gray-900">
        Eco-Stock
      </span>
    </div>

    
    <span class="loader"></span>

  </div>
</template>


<style scoped>

.loader-container {

  height: 100vh;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  text-align: center;

  padding: 20px;

  background: #f8fafc;

}


/* Titre */

h1 {

  color: #2563eb;

  font-size: 42px;

  margin-bottom: 15px;

}


h1 span {

  color: #2563eb;

}



/* Description */

p {

  max-width: 700px;

  color: #699cda;

  font-size: 20px;

  line-height: 1.6;

  margin-bottom: 40px;

}



/* Barre de chargement */

.loader {

  --color-1: #ffffff;
  --color-2: #2563eb;

  display: block;

  position: relative;

  height: 12px;

  width: 80%;

  max-width: 500px;

  border: 1px solid var(--color-1);

  border-radius: 10px;

  overflow: hidden;

}


.loader::after {

  content: "";

  position: absolute;

  left: 0;

  top: 0;

  height: 100%;

  width: 0;

  background: var(--color-2);

  animation: prog 4s ease forwards;

}



/* Animation */

@keyframes prog {

  from {
    width: 0%;
  }

  to {
    width: 100%;
  }

}


</style>