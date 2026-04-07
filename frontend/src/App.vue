<script setup>
import { RouterView } from "vue-router";

import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();
authStore.fetchUsager();

</script>

<template>
  <router-view />
</template>
