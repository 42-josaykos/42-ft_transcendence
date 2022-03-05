<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const generateState = () => {
  let state: string = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 40; i++) {
    state += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return state;
};

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

const baseUrl = 'https://api.intra.42.fr/oauth/authorize?';
const state = generateState();
sessionStorage.setItem('state_token', state);

const params: any = {
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: encodeURI('http://localhost:3001/game'),
  scope: 'public',
  state: state,
  response_type: 'code'
};

const qs = new URLSearchParams(params);
const requestUri = ref(baseUrl + qs);

function createLoggedUser() {
  localStorage.setItem('loggedUser', 'test_user logged');
  isAuthenticated.value = true;
}

function removeLoggedUser() {
  localStorage.removeItem('loggedUser');
  isAuthenticated.value = false;
}
</script>

<template>
  {{ requestUri }}
  <h2>Login</h2>
  <div v-if="!isAuthenticated">
    <router-link to="/game">
      <button class="btn btn-secondary" @click="createLoggedUser">
        Create log session
      </button>
    </router-link>
  </div>
  <div v-else>
    <button class="btn btn-danger" @click="removeLoggedUser">
      Remove log session
    </button>
  </div>
  <a class="btn btn-primary" :href="requestUri">Login 42 API</a>
</template>
