import { defineStore } from 'pinia';

export interface Input {
  search: string;
  create: string;
  create_channel: string;
  update_username: string;
  update_channel_name: string;
  user_id: string;
  match_id: string;
  channel_id: string;
  p1: string;
  p2: string;
  s1: string;
  s2: string;
  update_match_id: string;
  update_p1: string;
  update_p2: string;
  update_s1: string;
  update_s2: string;
}

export interface InputStore {
  [x: string]: any;
  input: Input;
}

export const useInputStore = defineStore('input', {
  state: () => {
    return {
      input: {
        search: '',
        create: '',
        create_channel: '',
        update_username: '',
        update_channel_name: '',
        user_id: '',
        match_id: '',
        channel_id: '',
        p1: '',
        p2: '',
        s1: '',
        s2: '',
        update_match_id: '',
        update_p1: '',
        update_p2: '',
        update_s1: '',
        update_s2: ''
      } as Input
    } as InputStore;
  }
});
