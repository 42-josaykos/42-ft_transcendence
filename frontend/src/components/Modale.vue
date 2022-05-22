<script setup lang="ts">
import { ref } from 'vue';
import Profil from './Profil.vue';
import Login from './Login.vue';
import Register from './Register.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const { setting_open, isAuthenticated, loggedUser, statusSocket } = storeToRefs(
  useUserStore()
);

async function getUserData() {
  statusSocket.value?.emit('updateUser', loggedUser.value);
}
</script>

<script lang="ts">
export const login_open = ref(false);
export const register_open = ref(false);
</script>

<template>
  <div class="bloc_modale" v-if="setting_open">
    <div class="overlay" @click="setting_open = !setting_open"></div>
    <div
      class="modale card scrollspy-profil"
      style="min-width: 40vw; max-width: 75%; overflow: auto"
    >
      <Profil @updateUserProfil="getUserData" />
    </div>
  </div>
  <div class="bloc_modale" v-if="register_open && !isAuthenticated">
    <div class="overlay" @click="register_open = !register_open"></div>
    <div class="modale card">
      <Register />
    </div>
  </div>
  <div class="bloc_modale" v-if="login_open && !isAuthenticated">
    <div class="overlay" @click="login_open = !login_open"></div>
    <div class="modale card">
      <Login />
    </div>
  </div>
</template>

<style>
@import url('../assets/modal.css');

.scrollspy-profil {
  position: relative;
  margin-top: 0.5rem;
  overflow: auto;

  overflow-y: scroll;
  scrollbar-width: none;
}

.scrollspy-profil::-webkit-scrollbar {
    display: none;
}

.scrollspy-profil::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-profil::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>
