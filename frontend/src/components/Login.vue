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
      <a class="btn btn-primary" href="/auth/login"> Login 42Stud </a>
    </div>
  </div>
  <div v-else>
    <a class="btn btn-danger" href="/auth/logout">Logout 42Stud</a>
  </div>
</template>
