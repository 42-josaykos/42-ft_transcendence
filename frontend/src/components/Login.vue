<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { Get } from '@/services/requests';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
</script>

<template>
  <h2 v-if="!isAuthenticated">Login</h2>
  <h2 v-else>Logout</h2>

  <div v-if="!isAuthenticated">
    <div>
      <a class="btn btn-primary" href="/auth/login"> Login with 42 </a>
    </div>
    <div>
      <a class="btn btn-info" href="/auth/login/github"> Login with Github </a>
    </div>
  </div>
  <div v-else>
    <a class="btn btn-danger" href="/auth/logout">Logout</a>
  </div>
</template>
