<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
</script>

<template>
  <div class="auth-form border border-primary">
    <h2 v-if="!isAuthenticated">Login</h2>
    <h2 v-else>Logout</h2>

    <div v-if="!isAuthenticated">
      <p>authentification pour accéder aux pages "Game" et "Chat"</p>
      <div>
        <a class="btn btn-primary" href="/auth/login"> Login with 42 </a>
      </div>
      <div>
        <a class="btn btn-info" href="/auth/login/github">
          Login with Github
        </a>
      </div>
    </div>
    <div v-else>
      <a class="btn btn-danger" href="/auth/logout">Logout</a>
    </div>
  </div>
</template>

<style>
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  padding: 10px;
  max-width: 50%;
}
</style>
