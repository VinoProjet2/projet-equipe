<script setup>
import { RouterView } from "vue-router";

import { useAuthStore } from "./stores/auth";
// récupérer les informations de l'usager connecté dès le chargement de l'application
const authStore = useAuthStore();
authStore.fetchUsager();
</script>

<template>
  <router-view />
</template>
