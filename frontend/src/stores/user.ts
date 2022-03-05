import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/models/user.model';

// Tracks users database
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const isAuthenticated = ref(false);

  return {
    users,
    isAuthenticated
  };
});
