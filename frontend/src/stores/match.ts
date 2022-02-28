import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    dataUsers: null
  }),
  actions: {
    deleteUser(id: string) {}
  }
});
