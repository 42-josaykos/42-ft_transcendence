<script setup lang="ts">
import Login from './Login.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
</script>

<template>
  <div class="containers-fluid">
    <div class="d-flex justify-content-center align-items-center pong">
      PONG
      <img src="../assets/42_Logo.svg" alt="42-logo" width="100" />
    </div>
    <div>
      <p>Expliquer l'appli Pong + image ??</p>
    </div>
    <div>
      <p>
        Match en cours sous forme de tableau ou de carte + boutons pour
        visualiser la partie
      </p>
    </div>
    <div v-if="!isAuthenticated">
      <Login />
    </div>
  </div>
</template>

<style>
.pong {
  font-size: 100px;
  color: black;
  text-align: center;
}

p.pong {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}
</style>
