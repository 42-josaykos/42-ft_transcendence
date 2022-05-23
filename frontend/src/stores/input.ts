import { defineStore } from 'pinia';

export const useInputStore = defineStore('input', {
  actions: {
    containsSpecialChars(str: string) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }
  }
});
