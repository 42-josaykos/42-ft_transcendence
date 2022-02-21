<script setup lang="ts">
import { onMounted, ref } from 'vue';

const generateState = () => {
  let state: string = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 40; i++) {
    state += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return state;
};

const baseUrl = 'https://api.intra.42.fr/oauth/authorize?';
const state = generateState();
window.sessionStorage.setItem('state_token', state);

const params: any = {
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: encodeURI('http://localhost:3001/game'),
  scope: 'public',
  state: state,
  response_type: 'code'
};

const qs = new URLSearchParams(params);
const requestUri = ref(baseUrl + qs);
</script>

<template>
  {{ requestUri }}
  <h2>Login</h2>
  <a :href="requestUri">Login</a>
</template>
