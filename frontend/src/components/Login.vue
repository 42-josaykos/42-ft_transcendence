<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { Get } from '@/services/requests';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

async function login42Stud() {
  isAuthenticated.value = true;
  console.log('login:', isAuthenticated.value);
}

async function logout42Stud() {
  isAuthenticated.value = false;
  console.log('logout:', isAuthenticated.value);
}
</script>

<template>
  <h2 v-if="!isAuthenticated">Login</h2>
  <h2 v-else>Logout</h2>

  <div v-if="!isAuthenticated">
    <div>
      <a class="btn btn-primary" @click="login42Stud"> Login 42Stud </a>
    </div>
  </div>
  <div v-else>
    <a class="btn btn-danger" href="/auth/logout" @click="logout42Stud"
      >Logout 42Stud</a
    >
  </div>
</template>
