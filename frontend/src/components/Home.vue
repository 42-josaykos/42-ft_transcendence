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
      <h1 class="GameName">SPACE PONG</h1>
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

.GameName{
  font-family: "Vibure", cursive;
  font-style: normal;
  font-weight: 400;
  font-size: 60px;
  line-height: 86px;

  color: #FFFFFF;

  text-shadow: 0px 4px 15px #FFF961, 0px 0px 10px #FFF961;
}
</style>
