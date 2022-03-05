<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

// Verify if user is already logged in browser's local storage
onMounted(() => {
  if (localStorage.getItem('loggedUser')) {
    isAuthenticated.value = true;
  }
});
</script>

<template>
  <div class="header">
    <!-- <img src="./assets/42_Logo.svg" alt="42-logo" width="100" /> -->
    <Navbar :isAuthenticated="isAuthenticated" />
  </div>
  <router-view />
</template>

<style>
.header {
  display: flex;
  flex-direction: column;
}
</style>
