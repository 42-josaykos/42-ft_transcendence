<script setup lang="ts">
import Navbar from './components/Navbar.vue'

</script>

<template>
  <div class="header">
    <img src="./assets/42_Logo.svg" alt="42-logo" width="100" />
    <Navbar />
  </div>
  <router-view />
</template>

<style>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
