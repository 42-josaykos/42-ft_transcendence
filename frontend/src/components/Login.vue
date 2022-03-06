<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

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
  <h2 v-if="!isAuthenticated">Login</h2>
  <h2 v-else>Logout</h2>

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
  <a class="btn btn-primary" href="/auth/login">Login 42 API</a>
</template>
