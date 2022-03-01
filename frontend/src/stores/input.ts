import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInputStore = defineStore('input', () => {
  const input = ref({
    search: '',
    create: '',
    update_username: '',
    user_id: '',
    match_id: '',
    p1: '',
    p2: '',
    s1: '',
    s2: '',
    update_match_id: '',
    update_p1: '',
    update_p2: '',
    update_s1: '',
    update_s2: ''
  });

  return {
    input
  };
});
